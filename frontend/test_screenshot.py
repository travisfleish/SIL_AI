import requests
import os
import urllib.parse
import time
import json
from PIL import Image
from io import BytesIO
from dotenv import load_dotenv
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Load environment variables
load_dotenv('.env.local')

# Set the path to the existing screenshots directory
current_dir = os.path.dirname(os.path.abspath(__file__))
SCREENSHOTS_DIR = os.path.join(current_dir, "public", "screenshots")

# List of failed tools with their row indices
FAILED_TOOLS = [
    {"name": "Perplexity", "url": "https://www.perplexity.ai/", "row": 4},
    {"name": "Perplexity", "url": "https://www.perplexity.ai", "row": 39},
    {"name": "SciSpace", "url": "https://www.scispace.com", "row": 41},
    {"name": "Edisn.ai", "url": "https://edisn.ai", "row": 57},
    {"name": "Reely", "url": "https://reely.ai", "row": 60},
    {"name": "Soccerment", "url": "https://soccerment.com", "row": 87}
]

# Advanced options to try with problematic sites
SCREENSHOT_OPTIONS = [
    {"name": "Default", "params": ""},
    {"name": "With delay", "params": "&delay=5000"},
    {"name": "Force capture", "params": "&force=true"},
    {"name": "Force with delay", "params": "&force=true&delay=5000"},
    {"name": "Mobile user agent",
     "params": "&force=true&user_agent=Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)"},
    {"name": "Cache buster", "params": "&cache_buster=true"},
    {"name": "Full page", "params": "&full_page=true"}
]


def get_sheets_service():
    """Create and return a Google Sheets service object using credentials from env variables"""
    account_email = os.getenv("GOOGLE_SERVICE_ACCOUNT_EMAIL")
    private_key = os.getenv("GOOGLE_PRIVATE_KEY").replace("\\n", "\n")

    credentials_dict = {
        "type": "service_account",
        "project_id": "sports-innovation-lab-ai",
        "private_key_id": "key-id",
        "private_key": private_key,
        "client_email": account_email,
        "client_id": "client-id",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{urllib.parse.quote(account_email)}"
    }

    credentials = service_account.Credentials.from_service_account_info(
        credentials_dict,
        scopes=['https://www.googleapis.com/auth/spreadsheets']
    )

    service = build('sheets', 'v4', credentials=credentials)
    return service


def check_url_availability(url):
    """Check if a URL is directly accessible before taking screenshot"""
    try:
        # Try with a simple GET request first
        head_response = requests.head(url, timeout=5, allow_redirects=True)
        print(f"HEAD request status: {head_response.status_code}")

        # If head request fails, try a normal GET
        if head_response.status_code >= 400:
            get_response = requests.get(url, timeout=10)
            print(f"GET request status: {get_response.status_code}")
            return get_response.status_code < 400, get_response.status_code

        return head_response.status_code < 400, head_response.status_code
    except Exception as e:
        print(f"Error checking URL directly: {e}")
        return False, "Error"


def try_alternative_url(url):
    """Try variations of the URL to find one that works"""
    variations = []

    # Try with and without www
    if "www." in url:
        variations.append(url.replace("www.", ""))
    else:
        if "://" in url:
            protocol, rest = url.split("://", 1)
            variations.append(f"{protocol}://www.{rest}")

    # Try with HTTPS instead of HTTP and vice versa
    if url.startswith("http://"):
        variations.append(url.replace("http://", "https://"))
    elif url.startswith("https://"):
        variations.append(url.replace("https://", "http://"))

    # Add trailing slash if missing
    if not url.endswith("/"):
        variations.append(url + "/")

    results = []
    for variant in variations:
        available, status = check_url_availability(variant)
        results.append({
            "url": variant,
            "available": available,
            "status": status
        })

    return results


def save_screenshot(url, name, option_index=0):
    """
    Try to take a screenshot with various options

    Args:
        url (str): URL of the tool
        name (str): Name of the tool
        option_index (int): Index of the option to try

    Returns:
        tuple: (success, message, screenshot_path)
    """
    if option_index >= len(SCREENSHOT_OPTIONS):
        return False, "All options exhausted", None

    option = SCREENSHOT_OPTIONS[option_index]
    print(f"\nTrying {option['name']} option for {name}...")

    try:
        filename = f"{name.replace(' ', '_').lower()}.png"
        save_path = os.path.join(SCREENSHOTS_DIR, filename)

        api_key = os.getenv("SCREENSHOTONE_API_KEY")
        if not api_key:
            return False, "SCREENSHOTONE_API_KEY not found in .env.local", None

        screenshot_url = f"https://api.screenshotone.com/take?access_key={api_key}&url={url}&viewport_width=1280&viewport_height=800&format=png{option['params']}"

        print(f"Making request to: {screenshot_url}")
        response = requests.get(screenshot_url, timeout=30)

        print(f"Response status: {response.status_code}")

        if response.status_code == 200:
            try:
                img = Image.open(BytesIO(response.content))
                print(f"Image size: {img.size}")

                # Ensure screenshots directory exists
                if not os.path.exists(SCREENSHOTS_DIR):
                    os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

                img.save(save_path)

                # Verify the file was saved
                if os.path.exists(save_path):
                    screenshot_path = f"/screenshots/{filename}"
                    return True, f"Success with {option['name']}", screenshot_path
                else:
                    return False, "Failed to save file", None
            except Exception as img_error:
                return False, f"Error processing image: {img_error}", None
        elif response.status_code == 402:
            return False, "API quota exceeded", None
        else:
            error_details = response.text[:200] if response.text else "No details"
            return False, f"HTTP {response.status_code}: {error_details}", None
    except Exception as e:
        return False, f"Exception: {e}", None


def update_screenshot_url_in_sheets(service, sheet_id, row_index, screenshot_url):
    """Update the screenshot URL for a tool in Google Sheets"""
    try:
        service.spreadsheets().values().update(
            spreadsheetId=sheet_id,
            range=f'Sheet1!E{row_index}',
            valueInputOption='RAW',
            body={'values': [[screenshot_url]]}
        ).execute()
        return True
    except Exception as e:
        print(f"Error updating Google Sheet: {e}")
        return False


def diagnose_tool(tool):
    """
    Run complete diagnostics on a tool that failed screenshot capture

    Args:
        tool (dict): Tool info with name, url and row
    """
    print("\n" + "=" * 60)
    print(f"DIAGNOSING: {tool['name']} (Row {tool['row']})")
    print("=" * 60)

    # Step 1: Check direct URL accessibility
    print("\n1. Checking URL accessibility...")
    available, status = check_url_availability(tool['url'])
    if available:
        print(f"✅ URL is directly accessible (Status {status})")
    else:
        print(f"❌ URL is not directly accessible (Status {status})")

        # Step 1b: Try URL variations
        print("\n1b. Trying URL variations...")
        variations = try_alternative_url(tool['url'])
        for var in variations:
            status_icon = "✅" if var['available'] else "❌"
            print(f"{status_icon} {var['url']} - Status: {var['status']}")

            # If found a working variation, suggest it
            if var['available']:
                print(f"💡 Suggestion: Try using {var['url']} instead")

    # Step 2: Try different screenshot options
    print("\n2. Testing different screenshot options...")
    for i in range(len(SCREENSHOT_OPTIONS)):
        success, message, path = save_screenshot(tool['url'], tool['name'], i)

        if success:
            print(f"✅ SUCCESS! {message}")
            print(f"📸 Screenshot saved to: {path}")

            # Step 3: Update Google Sheet if successful
            print("\n3. Updating Google Sheet...")
            service = get_sheets_service()
            sheet_id = os.getenv("SHEET_ID")
            if update_screenshot_url_in_sheets(service, sheet_id, tool['row'], path):
                print(f"✅ Updated screenshot URL in Google Sheet for row {tool['row']}")
            else:
                print(f"❌ Failed to update Google Sheet for row {tool['row']}")

            # No need to try more options
            break
        else:
            print(f"❌ {message}")

            # If we've run out of options
            if i == len(SCREENSHOT_OPTIONS) - 1:
                print("\n❌ Failed to capture screenshot with all options")
                print("💡 Suggestion: Consider taking a manual screenshot or checking the site directly")


def run_diagnostic():
    """Run diagnostics on all failed tools"""
    print("🔍 STARTING DIAGNOSTIC FOR FAILED SCREENSHOTS")
    print(f"📁 Using screenshots directory: {SCREENSHOTS_DIR}")

    if not os.path.exists(SCREENSHOTS_DIR):
        os.makedirs(SCREENSHOTS_DIR, exist_ok=True)
        print(f"Created screenshots directory at: {SCREENSHOTS_DIR}")

    for i, tool in enumerate(FAILED_TOOLS):
        diagnose_tool(tool)

        # Add small delay between tools
        if i < len(FAILED_TOOLS) - 1:
            print("\nWaiting 3 seconds before next tool...")
            time.sleep(3)

    print("\n" + "=" * 60)
    print("DIAGNOSTIC COMPLETE")
    print("=" * 60)


if __name__ == "__main__":
    run_diagnostic()