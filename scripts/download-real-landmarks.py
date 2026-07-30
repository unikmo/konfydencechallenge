#!/usr/bin/env python3
"""
Download real landmark images from Wikimedia Commons.
CC0 and CC-BY licensed images only - no copyright issues.
"""

import requests
import json
import time
from pathlib import Path
from urllib.parse import quote

OUTPUT_DIR = Path(__file__).parent.parent / "public" / "country-landmarks" / "countries"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Landmark search terms (best bets for free images on Wikimedia Commons)
LANDMARKS = {
    "egypt": "Pyramids of Giza",
    "india": "Taj Mahal",
    "china": "Great Wall of China",
    "japan": "Mount Fuji",
    "france": "Eiffel Tower",
    "italy": "Colosseum Rome",
    "germany": "Neuschwanstein Castle",
    "spain": "Sagrada Familia Barcelona",
    "greece": "Parthenon Athens",
    "uk": "Big Ben London",
    "united-kingdom": "Big Ben London",
    "austria": "Schonbrunn Palace Vienna",
    "switzerland": "Matterhorn",
    "netherlands": "Kinderdijk Windmills",
    "brazil": "Christ Redeemer Rio",
    "united-states": "Statue of Liberty",
    "canada": "Niagara Falls",
    "mexico": "Chichen Itza",
    "peru": "Machu Picchu",
    "argentina": "Cristo Redentor",
    "south-africa": "Table Mountain Cape Town",
    "australia": "Sydney Opera House",
    "thailand": "Grand Palace Bangkok",
    "cambodia": "Angkor Wat",
    "vietnam": "Halong Bay",
    "indonesia": "Borobudur Temple",
    "south-korea": "Gyeongbokgung Palace",
    "turkey": "Hagia Sophia Istanbul",
    "jordan": "Petra",
    "israel": "Western Wall Jerusalem",
    "morocco": "Jemaa el-Fnaa Marrakech",
    "kenya": "Maasai Mara",
    "tanzania": "Mount Kilimanjaro",
    "new-zealand": "Milford Sound",
    "iceland": "Gullfoss Waterfall",
    "norway": "Preikestolen",
    "scotland": "Edinburgh Castle",
}

def search_wikimedia_commons(landmark: str) -> dict:
    """Search Wikimedia Commons API for landmark images."""
    try:
        url = "https://commons.wikimedia.org/w/api.php"
        params = {
            "action": "query",
            "list": "search",
            "srsearch": landmark,
            "srwhat": "image",
            "srlimit": 20,
            "format": "json",
        }

        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"  Error searching: {e}")
        return {}

def get_image_url(title: str) -> str:
    """Get the actual image URL from Wikimedia Commons file page."""
    try:
        url = "https://commons.wikimedia.org/w/api.php"
        params = {
            "action": "query",
            "titles": title,
            "prop": "imageinfo",
            "iiprop": "url",
            "format": "json",
        }

        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()

        pages = data.get("query", {}).get("pages", {})
        if pages:
            page = list(pages.values())[0]
            imageinfo = page.get("imageinfo", [])
            if imageinfo:
                return imageinfo[0].get("url", "")
        return ""
    except Exception as e:
        print(f"  Error getting image: {e}")
        return ""

def download_image(url: str, filepath: Path) -> bool:
    """Download image from URL."""
    try:
        response = requests.get(url, timeout=30, stream=True)
        response.raise_for_status()

        # Check file size (limit to 1MB for reasonable quality)
        size = int(response.headers.get('content-length', 0))
        if size == 0 or size > 2000000:
            print(f"  Size check failed: {size} bytes")
            return False

        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)

        file_size = filepath.stat().st_size
        if file_size < 5000:  # Too small
            filepath.unlink()
            return False

        print(f"  ✓ Downloaded: {file_size/1024:.1f}KB")
        return True
    except Exception as e:
        print(f"  Error downloading: {e}")
        return False

def main():
    """Download real landmark images."""
    print("🏛️  Downloading Real Landmark Images from Wikimedia Commons")
    print("=" * 70)

    success_count = 0
    skip_count = 0
    fail_count = 0

    for country_slug, landmark in sorted(LANDMARKS.items()):
        jpg_file = OUTPUT_DIR / f"{country_slug}.jpg"

        if jpg_file.exists():
            print(f"✓ {country_slug}: Photo exists ({jpg_file.stat().st_size/1024:.0f}KB)")
            skip_count += 1
            continue

        print(f"\n→ {country_slug}: Searching for '{landmark}'...")

        # Search for the landmark
        search_results = search_wikimedia_commons(landmark)
        results = search_results.get("query", {}).get("search", [])

        if not results:
            print(f"  No results found")
            fail_count += 1
            continue

        # Try each result until one downloads successfully
        found = False
        for result in results[:5]:  # Try top 5 results
            title = result["title"]
            image_url = get_image_url(title)

            if image_url:
                if download_image(image_url, jpg_file):
                    success_count += 1
                    found = True
                    break

        if not found:
            print(f"  Failed to download suitable image")
            fail_count += 1

        time.sleep(2)  # Rate limiting - be respectful to Wikimedia

    print("\n" + "=" * 70)
    print(f"📊 Results:")
    print(f"   Downloaded: {success_count}")
    print(f"   Skipped: {skip_count}")
    print(f"   Failed: {fail_count}")
    print(f"   Total: {success_count + skip_count + fail_count}")

if __name__ == "__main__":
    main()
