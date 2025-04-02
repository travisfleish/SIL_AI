#!/usr/bin/env python3
"""
Flask Cleanup Script

This script helps identify Flask-related files in your project that may be
obsolete after migrating to a Next.js frontend. It creates a report of files
to review and optionally allows for deletion after confirmation.

Usage:
    python flask_cleanup.py /path/to/your/project
"""

import os
import sys
import re
from pathlib import Path
import shutil

# Flask and Python patterns to look for
FLASK_PATTERNS = [
    # Flask specific files
    r"app\.py$",
    r"wsgi\.py$",
    r"gunicorn\.conf\.py$",
    r"uwsgi\.ini$",
    r"flask_app\.py$",
    r"^__init__\.py$",
    r"^routes\.py$",
    r"^views\.py$",
    r"^models\.py$",

    # Flask specific imports in Python files
    r"from\s+flask\s+import",
    r"import\s+flask",
    r"from\s+flask_",

    # Common Flask extension patterns
    r"flask_sqlalchemy",
    r"flask_login",
    r"flask_migrate",
    r"flask_wtf",
    r"flask_mail",
    r"flask_admin",
    r"flask_restful",
]

# Directories likely to be Flask-related
FLASK_DIRS = [
    "templates",
    "static",
    "instance",
    "migrations",
    "venv",
    "env",
    ".venv",
    "__pycache__",
    ".pytest_cache",
]

# Files likely to be Flask-related
FLASK_FILES = [
    "requirements.txt",
    "Pipfile",
    "Pipfile.lock",
    "setup.py",
    ".flaskenv",
    "pytest.ini",
    "config.py",
    ".python-version",
]


def is_flask_file(file_path):
    """Check if a file is likely Flask-related."""
    # Check if filename matches Flask patterns
    file_name = os.path.basename(file_path)
    if any(re.search(pattern, file_name) for pattern in FLASK_PATTERNS):
        return True

    # Check for Python files that might contain Flask code
    if file_path.endswith(".py"):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
                if any(re.search(pattern, content) for pattern in FLASK_PATTERNS):
                    return True
        except (UnicodeDecodeError, IOError):
            # Skip binary files or files that can't be read
            pass

    return False


def find_flask_files(project_dir):
    """Find Flask-related files and directories in the project."""
    flask_files = []
    flask_dirs = []

    for root, dirs, files in os.walk(project_dir):
        # Skip node_modules, .git, .next, and .venv directories
        if "node_modules" in root or ".git" in root or ".next" in root or ".venv" in root:
            continue

        # Check directories
        for dir_name in dirs[:]:  # Create a copy to safely modify during iteration
            dir_path = os.path.join(root, dir_name)
            rel_dir_path = os.path.relpath(dir_path, project_dir)

            if dir_name in FLASK_DIRS or dir_name.endswith("__pycache__"):
                flask_dirs.append(rel_dir_path)

        # Check files
        for file_name in files:
            file_path = os.path.join(root, file_name)
            rel_file_path = os.path.relpath(file_path, project_dir)

            if file_name in FLASK_FILES or is_flask_file(file_path):
                flask_files.append(rel_file_path)

    return flask_files, flask_dirs


def prompt_delete(items, item_type):
    """Prompt the user to delete a list of items."""
    print(f"\n----- {item_type} To Review -----")
    if not items:
        print(f"No {item_type.lower()} found.")
        return

    for i, item in enumerate(items, 1):
        print(f"{i}. {item}")

    choice = input(f"\nDo you want to delete any of these {item_type.lower()}? (y/n): ").lower()
    if choice == 'y':
        indices_input = input(f"Enter the numbers to delete (comma-separated), 'all' for all, or 'q' to quit: ")
        if indices_input.lower() == 'q':
            return

        if indices_input.lower() == 'all':
            indices = list(range(1, len(items) + 1))
        else:
            try:
                indices = [int(idx.strip()) for idx in indices_input.split(',')]
            except ValueError:
                print("Invalid input. No items deleted.")
                return

        for idx in sorted(indices, reverse=True):
            if 1 <= idx <= len(items):
                item_path = os.path.join(project_dir, items[idx - 1])
                try:
                    if os.path.isdir(item_path):
                        shutil.rmtree(item_path)
                    else:
                        os.remove(item_path)
                    print(f"Deleted: {items[idx - 1]}")
                except Exception as e:
                    print(f"Error deleting {items[idx - 1]}: {e}")
            else:
                print(f"Invalid index: {idx}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} /path/to/your/project")
        sys.exit(1)

    project_dir = sys.argv[1]
    if not os.path.isdir(project_dir):
        print(f"Error: {project_dir} is not a valid directory")
        sys.exit(1)

    print(f"Scanning {project_dir} for Flask-related files and directories...")
    files, dirs = find_flask_files(project_dir)

    print("\nSummary:")
    print(f"Found {len(files)} potential Flask-related files")
    print(f"Found {len(dirs)} potential Flask-related directories")

    # Display and prompt for files first
    prompt_delete(files, "Files")

    # Then directories (always do directories after files to avoid issues)
    prompt_delete(dirs, "Directories")

    print("\nCleanup process completed. Review your project to ensure everything works as expected.")
    print("Note: This script may not identify all Flask-related files, and may identify false positives.")