import requests
from bs4 import BeautifulSoup
import os
import re
import urllib.parse
from concurrent.futures import ThreadPoolExecutor
import time

# Create output directory in frontend/public
OUTPUT_DIR = "frontend/public/logos"
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)
    print(f"Created directory: {OUTPUT_DIR}")

# URL of the Sports Innovation Lab website
BASE_URL = "https://www.sportsilab.com"


def clean_filename(filename):
    """Clean the filename to make it valid for the filesystem"""
    return re.sub(r'[\\/*?:"<>|]', "", filename)


def download_image(img_url, base_url):
    """Download an image if it matches our criteria"""
    # Make sure URL is absolute
    if not img_url.startswith(('http://', 'https://')):
        img_url = urllib.parse.urljoin(base_url, img_url)

    # Check if it's a ClientLogo file
    filename = os.path.basename(urllib.parse.urlparse(img_url).path)
    if not (filename.startswith("ClientLogo") and filename.lower().endswith((".jpg", ".jpeg", ".png"))):
        return None

    try:
        response = requests.get(img_url, stream=True, timeout=10)
        if response.status_code == 200:
            clean_name = clean_filename(filename)
            file_path = os.path.join(OUTPUT_DIR, clean_name)
            with open(file_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=1024):
                    if chunk:
                        f.write(chunk)
            print(f"✓ Downloaded: {clean_name}")
            return file_path
        else:
            print(f"✗ Failed to download {img_url}. Status code: {response.status_code}")
            return None
    except Exception as e:
        print(f"✗ Error downloading {img_url}: {e}")
        return None


def extract_logo_urls_from_network_requests(url):
    """
    Visit the page with requests and look for image URLs in sources
    This won't capture dynamically loaded images
    """
    try:
        response = requests.get(url, timeout=15)
        if response.status_code != 200:
            print(f"Failed to fetch the website. Status code: {response.status_code}")
            return []

        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract image tags
        img_tags = soup.find_all('img')
        img_urls = [img.get('src') for img in img_tags if img.get('src')]

        # Extract background images from inline styles
        style_tags = soup.find_all(['div', 'section', 'span', 'a'], style=True)
        style_urls = []
        for tag in style_tags:
            style = tag.get('style', '')
            urls = re.findall(r'url\([\'"]?(.*?)[\'"]?\)', style)
            style_urls.extend(urls)

        # Extract from CSS
        style_tags = soup.find_all('style')
        for style in style_tags:
            if style.string:
                urls = re.findall(r'url\([\'"]?(.*?)[\'"]?\)', style.string)
                style_urls.extend(urls)

        # Combine all URLs
        all_urls = img_urls + style_urls

        # Filter only for URLs that might contain ClientLogo
        client_logo_urls = [url for url in all_urls if 'ClientLogo' in url or 'logo' in url.lower()]

        return client_logo_urls

    except Exception as e:
        print(f"Error fetching the webpage: {e}")
        return []


def scan_additional_pages(base_url):
    """
    Scans additional pages like About, Partners, etc. that might contain logos
    """
    additional_pages = [
        "/about",
        "/partners",
        "/clients",
        "/team",
        "/contact",
        "/solutions",
        "/case-studies"
    ]

    all_urls = []

    for page in additional_pages:
        try:
            page_url = base_url + page
            print(f"Scanning additional page: {page_url}")
            urls = extract_logo_urls_from_network_requests(page_url)
            all_urls.extend(urls)
            # Be nice to the server
            time.sleep(1)
        except Exception as e:
            print(f"Error scanning {page_url}: {e}")

    return list(set(all_urls))  # Remove duplicates


def main():
    print("Starting Sports Innovation Lab logo scraper...")

    # Get logo URLs from the main page
    print(f"Scanning main website: {BASE_URL}")
    main_page_urls = extract_logo_urls_from_network_requests(BASE_URL)

    # Get logo URLs from additional pages
    additional_urls = scan_additional_pages(BASE_URL)

    # Combine and remove duplicates
    all_urls = list(set(main_page_urls + additional_urls))

    if not all_urls:
        print("No logo URLs found. The website might be loading images dynamically.")
        print("Try using browser's Network tab to capture those requests.")
        return

    print(f"Found {len(all_urls)} potential logo URLs.")

    # Download images in parallel
    downloaded_count = 0
    with ThreadPoolExecutor(max_workers=5) as executor:
        results = list(executor.map(lambda url: download_image(url, BASE_URL), all_urls))
        downloaded_count = sum(1 for r in results if r is not None)

    if downloaded_count > 0:
        print(f"\nSuccess! Downloaded {downloaded_count} logo files to the '{OUTPUT_DIR}' folder.")
    else:
        print("\nNo logo files matching your criteria were found or downloaded.")
        print("You might need to manually check the Network tab in your browser's developer tools.")


if __name__ == "__main__":
    main()