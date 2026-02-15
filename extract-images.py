import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import json
import re

pages = [
    ("accueil", "https://www.hallucinecran.com/fr/accueil"),
    ("ecran-geant", "https://www.hallucinecran.com/fr/ecran-gonflable-geant"),
    ("ecran-etanche", "https://www.hallucinecran.com/fr/ecran-gonflable-etanche-a-l-air"),
    ("ecran-economique", "https://www.hallucinecran.com/fr/ecran-economique"),
    ("tentes-x", "https://www.hallucinecran.com/fr/tentes-x"),
    ("tentes-n", "https://www.hallucinecran.com/fr/tentes-gonflables-n"),
    ("tentes-v", "https://www.hallucinecran.com/fr/tentes-v"),
    ("tentes-araignees", "https://www.hallucinecran.com/fr/tentes-araignees"),
    ("arches", "https://www.hallucinecran.com/fr/arches-gonflables"),
    ("mobilier", "https://www.hallucinecran.com/fr/mobilier-gonflable"),
    ("accessoires", "https://www.hallucinecran.com/fr/accessoires"),
    ("galerie", "https://www.hallucinecran.com/fr/galerie"),
    ("mode-emploi", "https://www.hallucinecran.com/fr/mode-emploi"),
    ("a-propos", "https://www.hallucinecran.com/fr/a-propos"),
    ("contactez-nous", "https://www.hallucinecran.com/fr/contactez-nous"),
]

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

all_images = {}

for name, url in pages:
    print(f"Scanning {name}...")
    try:
        resp = requests.get(url, headers=headers, timeout=15)
        soup = BeautifulSoup(resp.text, "html.parser")
        
        images = []
        
        # img tags
        for img in soup.find_all("img"):
            src = img.get("src", "")
            if not src or src.startswith("data:"):
                continue
            full_url = urljoin(url, src)
            alt = img.get("alt", "")
            # Skip tiny icons
            width = img.get("width", "")
            height = img.get("height", "")
            try:
                if width and float(width) < 50:
                    continue
                if height and float(height) < 50:
                    continue
            except (ValueError, TypeError):
                pass
            images.append({"url": full_url, "alt": alt, "type": "img"})
        
        # Background images in style attributes
        for el in soup.find_all(style=True):
            style = el.get("style", "")
            bg_matches = re.findall(r'background(?:-image)?\s*:\s*url\(["\']?([^"\')\s]+)["\']?\)', style)
            for bg_url in bg_matches:
                full_url = urljoin(url, bg_url)
                images.append({"url": full_url, "alt": "", "type": "background"})
        
        # Also check for data-src (lazy loading)
        for img in soup.find_all(attrs={"data-src": True}):
            src = img.get("data-src", "")
            if src and not src.startswith("data:"):
                full_url = urljoin(url, src)
                alt = img.get("alt", "")
                images.append({"url": full_url, "alt": alt, "type": "lazy"})
        
        # Deduplicate
        seen = set()
        unique = []
        for img in images:
            if img["url"] not in seen:
                seen.add(img["url"])
                unique.append(img)
        
        all_images[name] = unique
        print(f"  Found {len(unique)} images")
        
    except Exception as e:
        print(f"  Error: {e}")
        all_images[name] = []

# Save results
with open("/home/ubuntu/hallucine-site/reference-images.json", "w") as f:
    json.dump(all_images, f, indent=2, ensure_ascii=False)

# Print summary
total = sum(len(v) for v in all_images.values())
print(f"\nTotal: {total} images across {len(all_images)} pages")
for name, imgs in all_images.items():
    print(f"  {name}: {len(imgs)} images")
    for img in imgs[:5]:
        print(f"    - {img['url'][:100]}... alt='{img['alt'][:50]}'")
    if len(imgs) > 5:
        print(f"    ... and {len(imgs)-5} more")
