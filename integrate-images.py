#!/usr/bin/env python3
"""
Script pour intégrer les images du site de référence dans les pages du nouveau site.
Remplace les images Unsplash placeholder par les vraies images de hallucinecran.com.
"""
import re
import os
import json

SRC_DIR = "/home/ubuntu/hallucine-site/client/src"

# Load reference images
with open("/home/ubuntu/hallucine-site/reference-images.json") as f:
    ref_images = json.load(f)

# ============================================================
# Helper: replace image src in a file
# ============================================================
def replace_in_file(filepath, replacements):
    """replacements: list of (old_pattern, new_url) tuples"""
    with open(filepath, 'r') as f:
        content = f.read()
    
    changed = False
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new, 1)
            changed = True
            print(f"  ✅ Replaced: {old[:60]}... → {new[:60]}...")
    
    if changed:
        with open(filepath, 'w') as f:
            f.write(content)
    return changed

# ============================================================
# Find all Unsplash URLs in a file
# ============================================================
def find_unsplash_urls(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    return re.findall(r'https://images\.unsplash\.com/[^"\'`\s]+', content)

# ============================================================
# Process each page
# ============================================================

# --- EcranGeant.tsx ---
print("\n=== EcranGeant.tsx ===")
filepath = os.path.join(SRC_DIR, "pages/EcranGeant.tsx")
unsplash = find_unsplash_urls(filepath)
print(f"  Found {len(unsplash)} Unsplash URLs")
geant_images = [
    "https://www.hallucinecran.com/Products/21.PNG",
    "https://www.hallucinecran.com/Products/ecran-geant-gonflable-24x15-metres.PNG",
    "https://www.hallucinecran.com/Products/23.PNG",
    "https://www.hallucinecran.com/Products/24.PNG",
    "https://www.hallucinecran.com/Giant%20Inf/1.webp",
    "https://www.hallucinecran.com/Gallery/46.webp",
    "https://www.hallucinecran.com/Giant%20Inf/4.webp",
    "https://www.hallucinecran.com/Giant%20Inf/6.webp",
    "https://www.hallucinecran.com/Giant%20Inf/8.webp",
    "https://www.hallucinecran.com/Giant%20Inf/9.webp",
    "https://www.hallucinecran.com/Giant%20Inf/10.webp",
]
replacements = list(zip(unsplash[:len(geant_images)], geant_images))
replace_in_file(filepath, replacements)

# --- EcranEtanche.tsx ---
print("\n=== EcranEtanche.tsx ===")
filepath = os.path.join(SRC_DIR, "pages/EcranEtanche.tsx")
unsplash = find_unsplash_urls(filepath)
print(f"  Found {len(unsplash)} Unsplash URLs")
etanche_images = [
    "https://www.hallucinecran.com/Products/25.PNG",
    "https://www.hallucinecran.com/homepage/3%20ECRANS%201%20CANAPE%20-1-.jpg",
    "https://www.hallucinecran.com/ecran%20etanches.jpg",
]
replacements = list(zip(unsplash[:len(etanche_images)], etanche_images))
replace_in_file(filepath, replacements)

# --- EcranEconomique.tsx ---
print("\n=== EcranEconomique.tsx ===")
filepath = os.path.join(SRC_DIR, "pages/EcranEconomique.tsx")
unsplash = find_unsplash_urls(filepath)
print(f"  Found {len(unsplash)} Unsplash URLs")
eco_images = [
    "https://www.hallucinecran.com/1/20160902_183937.jpg",
    "https://www.hallucinecran.com/Gallery/48.webp",
    "https://www.hallucinecran.com/Giant%20Inf/2.PNG",
    "https://www.hallucinecran.com/ecran%20etanches.jpg",
    "https://www.hallucinecran.com/Le%20cin%C3%A9ma%20%C3%A0%20la%20maison%20037.jpg",
    "https://www.hallucinecran.com/ECRAN%207-5.jpg",
]
replacements = list(zip(unsplash[:len(eco_images)], eco_images))
replace_in_file(filepath, replacements)

# --- TentesX.tsx ---
print("\n=== TentesX.tsx ===")
filepath = os.path.join(SRC_DIR, "pages/TentesX.tsx")
unsplash = find_unsplash_urls(filepath)
print(f"  Found {len(unsplash)} Unsplash URLs")
x_images = [
    "https://www.hallucinecran.com/Tentes/Tentes%20X/tente-x.jpg",
    "https://www.hallucinecran.com/Tentes/Tentes%20X/671bade5ef4fb27a93d3034de910dc4.jpg",
    "https://www.hallucinecran.com/Tentes/Tentes%20X/1078c8cca1c101dbe2d41d70cadf4a0.jpg",
    "https://www.hallucinecran.com/Tentes/xtent-1.jpg",
    "https://www.hallucinecran.com/Tentes/x%20tent%20Eclate%20french-1.jpg",
]
replacements = list(zip(unsplash[:len(x_images)], x_images))
replace_in_file(filepath, replacements)

# --- TentesN.tsx ---
print("\n=== TentesN.tsx ===")
filepath = os.path.join(SRC_DIR, "pages/TentesN.tsx")
unsplash = find_unsplash_urls(filepath)
print(f"  Found {len(unsplash)} Unsplash URLs")
n_images = [
    "https://www.hallucinecran.com/Tentes/Tentes%20N/ntent.jpg",
    "https://www.hallucinecran.com/Tentes/Tentes%20N/761c537e749de68e706a65456057742.jpg",
    "https://www.hallucinecran.com/Tentes/Tentes%20N/Weixin%20Image_20240530160054.jpg",
    "https://www.hallucinecran.com/Tentes/Tentes%20N/Weixin%20Image_20240530160133.jpg",
    "https://www.hallucinecran.com/Tentes/Tentes%20N/ntent%20eclate%20french.jpg",
    "https://www.hallucinecran.com/Tentes/Tentes%20N/tentes-gonflables-n-croix-rouge.jpg",
]
replacements = list(zip(unsplash[:len(n_images)], n_images))
replace_in_file(filepath, replacements)

# --- TentesV.tsx ---
print("\n=== TentesV.tsx ===")
filepath = os.path.join(SRC_DIR, "pages/TentesV.tsx")
unsplash = find_unsplash_urls(filepath)
print(f"  Found {len(unsplash)} Unsplash URLs")
v_images = [
    "https://www.hallucinecran.com/photoset/Tentes%20V/blanc%201.jpg",
    "https://www.hallucinecran.com/photoset/Tentes%20V/blanc%202.jpg",
    "https://www.hallucinecran.com/photoset/Tentes%20V/blanc%203.jpg",
    "https://www.hallucinecran.com/photoset/Tentes%20V/eclate%20en%20francais.jpg",
    "https://www.hallucinecran.com/photoset/Tentes%20V/15b4c24de8e92b7b9047951a3057fe0.jpg",
]
replacements = list(zip(unsplash[:len(v_images)], v_images))
replace_in_file(filepath, replacements)

# --- TentesAraignees.tsx ---
print("\n=== TentesAraignees.tsx ===")
filepath = os.path.join(SRC_DIR, "pages/TentesAraignees.tsx")
unsplash = find_unsplash_urls(filepath)
print(f"  Found {len(unsplash)} Unsplash URLs")
spider_images = [
    "https://www.hallucinecran.com/Tentes/Tents%20spider/Sider%20tentes%20bleues.jpg",
    "https://www.hallucinecran.com/photoset/Tents%20spider/Sider%20tentes%20rideau%20jaunes.jpg",
    "https://www.hallucinecran.com/photoset/Tents%20spider/Sider%20tentes%20vertes.png",
    "https://www.hallucinecran.com/photoset/Tents%20spider/Sider%20tentes%20noir%20jaunes.jpg",
    "https://www.hallucinecran.com/Tentes/Tents%20spider/Sider%20tentes%20noires%20mouchetees.jpg",
]
replacements = list(zip(unsplash[:len(spider_images)], spider_images))
replace_in_file(filepath, replacements)

# --- Mobilier.tsx ---
print("\n=== Mobilier.tsx ===")
filepath = os.path.join(SRC_DIR, "pages/Mobilier.tsx")
unsplash = find_unsplash_urls(filepath)
print(f"  Found {len(unsplash)} Unsplash URLs")
mob_images = [
    "https://www.hallucinecran.com/Tentes/meubles/fauteuils%20tabouret.jpg",
    "https://www.hallucinecran.com/Tentes/meubles/canape%20fauteuil%20noir%20rouge.jpg",
    "https://www.hallucinecran.com/Tentes/meubles/fauteuil.jpg",
    "https://www.hallucinecran.com/Tentes/meubles/Bar.jpg",
    "https://www.hallucinecran.com/Tentes/meubles/mange%20debout.jpg",
    "https://www.hallucinecran.com/Tentes/meubles/canape%20bleu.jpg",
]
replacements = list(zip(unsplash[:len(mob_images)], mob_images))
replace_in_file(filepath, replacements)

# --- Accessoires.tsx ---
print("\n=== Accessoires.tsx ===")
filepath = os.path.join(SRC_DIR, "pages/Accessoires.tsx")
unsplash = find_unsplash_urls(filepath)
print(f"  Found {len(unsplash)} Unsplash URLs")
acc_images = [
    "https://www.hallucinecran.com/Accessories/unnamed-17-1920w.webp",
    "https://www.hallucinecran.com/Accessories/unnamed-16-1920w.webp",
    "https://www.hallucinecran.com/Accessories/unnamed-1920w.webp",
    "https://www.hallucinecran.com/Accessories/unnamed-12-e18b2f45-1920w.webp",
    "https://www.hallucinecran.com/Accessories/unnamed-8-565be1f7-1920w.webp",
    "https://www.hallucinecran.com/Accessories/unnamed-19-1920w.webp",
]
replacements = list(zip(unsplash[:len(acc_images)], acc_images))
replace_in_file(filepath, replacements)

# --- ModeEmploi.tsx ---
print("\n=== ModeEmploi.tsx ===")
filepath = os.path.join(SRC_DIR, "pages/ModeEmploi.tsx")
unsplash = find_unsplash_urls(filepath)
print(f"  Found {len(unsplash)} Unsplash URLs")
# Mode emploi uses specific schematic images, not Unsplash typically
# But let's check and replace what we can
mode_images = [
    "https://www.hallucinecran.com/Croquis%20mode%20emploi/huawei-2hp-blower.jpg",
    "https://www.hallucinecran.com/Croquis%20mode%20emploi/metre.jpg",
    "https://www.hallucinecran.com/Croquis%20mode%20emploi/bache.jpg",
    "https://www.hallucinecran.com/Croquis%20mode%20emploi/piquet-galvanise-acier-tente-de-reception-barnum-big.jpg",
    "https://www.hallucinecran.com/Croquis%20mode%20emploi/masse.webp",
    "https://www.hallucinecran.com/Croquis%20mode%20emploi/1.jpg",
    "https://www.hallucinecran.com/Croquis%20mode%20emploi/2.jpg",
    "https://www.hallucinecran.com/Croquis%20mode%20emploi/3.jpg",
    "https://www.hallucinecran.com/Croquis%20mode%20emploi/4.jpg",
    "https://www.hallucinecran.com/Croquis%20mode%20emploi/5.jpg",
    "https://www.hallucinecran.com/Croquis%20mode%20emploi/6.jpg",
    "https://www.hallucinecran.com/Croquis%20mode%20emploi/7.jpg",
    "https://www.hallucinecran.com/Croquis%20mode%20emploi/gif%20noeud.gif",
]
replacements = list(zip(unsplash[:len(mode_images)], mode_images))
replace_in_file(filepath, replacements)

# --- APropos.tsx ---
print("\n=== APropos.tsx ===")
filepath = os.path.join(SRC_DIR, "pages/APropos.tsx")
unsplash = find_unsplash_urls(filepath)
print(f"  Found {len(unsplash)} Unsplash URLs")
apropos_images = [
    "https://www.hallucinecran.com/Accessories/1.PNG",
    "https://www.hallucinecran.com/Accessories/2.PNG",
    "https://www.hallucinecran.com/homepage/unnamed-7-640w.webp",
]
replacements = list(zip(unsplash[:len(apropos_images)], apropos_images))
replace_in_file(filepath, replacements)

# --- ArchesGonflables.tsx ---
print("\n=== ArchesGonflables.tsx ===")
filepath = os.path.join(SRC_DIR, "pages/ArchesGonflables.tsx")
unsplash = find_unsplash_urls(filepath)
print(f"  Found {len(unsplash)} Unsplash URLs")
# No arches images were found in the extraction (page returned 0)
# Use some from other pages that show arches
arches_images = [
    "https://www.hallucinecran.com/photoset/Gallery/Ecran%20-%20Arche%20sur%20toit.JPG",
]
replacements = list(zip(unsplash[:len(arches_images)], arches_images))
replace_in_file(filepath, replacements)

# --- Galerie.tsx ---
print("\n=== Galerie.tsx ===")
filepath = os.path.join(SRC_DIR, "pages/Galerie.tsx")
unsplash = find_unsplash_urls(filepath)
print(f"  Found {len(unsplash)} Unsplash URLs")
# Replace with real gallery images
gallery_images = [f"https://www.hallucinecran.com/photoset/Gallery/{i}.webp" for i in range(1, 51)]
replacements = list(zip(unsplash[:len(gallery_images)], gallery_images))
replace_in_file(filepath, replacements)

# --- Home.tsx (HeroSection, ProductsSection, etc.) ---
print("\n=== Home components ===")
for comp in ["HeroSection.tsx", "ProductsSection.tsx", "TechnologySection.tsx", "StorySection.tsx", "RealisationsSection.tsx"]:
    filepath = os.path.join(SRC_DIR, f"components/{comp}")
    if os.path.exists(filepath):
        unsplash = find_unsplash_urls(filepath)
        print(f"  {comp}: Found {len(unsplash)} Unsplash URLs")

# --- Ecrans.tsx (hub page) ---
print("\n=== Ecrans.tsx ===")
filepath = os.path.join(SRC_DIR, "pages/Ecrans.tsx")
unsplash = find_unsplash_urls(filepath)
print(f"  Found {len(unsplash)} Unsplash URLs")
ecrans_hub = [
    "https://www.hallucinecran.com/homepage/20180712_191353-640w.webp",
    "https://www.hallucinecran.com/Products/25.PNG",
    "https://www.hallucinecran.com/homepage/20180321_191447-640w.webp",
]
replacements = list(zip(unsplash[:len(ecrans_hub)], ecrans_hub))
replace_in_file(filepath, replacements)

# --- Tentes.tsx (hub page) ---
print("\n=== Tentes.tsx ===")
filepath = os.path.join(SRC_DIR, "pages/Tentes.tsx")
unsplash = find_unsplash_urls(filepath)
print(f"  Found {len(unsplash)} Unsplash URLs")
tentes_hub = [
    "https://www.hallucinecran.com/Tentes/Tentes%20X/tente-x.jpg",
    "https://www.hallucinecran.com/Tentes/Tentes%20N/ntent.jpg",
    "https://www.hallucinecran.com/photoset/Tentes%20V/blanc%201.jpg",
    "https://www.hallucinecran.com/Tentes/Tents%20spider/Sider%20tentes%20bleues.jpg",
    "https://www.hallucinecran.com/photoset/Gallery/Ecran%20-%20Arche%20sur%20toit.JPG",
    "https://www.hallucinecran.com/Tentes/meubles/fauteuils%20tabouret.jpg",
]
replacements = list(zip(unsplash[:len(tentes_hub)], tentes_hub))
replace_in_file(filepath, replacements)

# --- Histoire.tsx ---
print("\n=== Histoire.tsx ===")
filepath = os.path.join(SRC_DIR, "pages/Histoire.tsx")
if os.path.exists(filepath):
    unsplash = find_unsplash_urls(filepath)
    print(f"  Found {len(unsplash)} Unsplash URLs")
    histoire_images = [
        "https://www.hallucinecran.com/homepage/unnamed-7-640w.webp",
        "https://www.hallucinecran.com/Historique/jonathan-directeur-commercial.jpg",
        "https://www.hallucinecran.com/Historique/directeur-technique-bruno.jpg",
        "https://www.hallucinecran.com/homepage/a1a31d63853971263b534bf592589bc98675eb35-fe5056d9-39f3f3db-c6656874-201w.webp",
    ]
    replacements = list(zip(unsplash[:len(histoire_images)], histoire_images))
    replace_in_file(filepath, replacements)

# --- Contact.tsx ---
print("\n=== Contact.tsx ===")
filepath = os.path.join(SRC_DIR, "pages/Contact.tsx")
unsplash = find_unsplash_urls(filepath)
print(f"  Found {len(unsplash)} Unsplash URLs")
contact_images = [
    "https://www.hallucinecran.com/Accessories/3.PNG",
]
replacements = list(zip(unsplash[:len(contact_images)], contact_images))
replace_in_file(filepath, replacements)

# ============================================================
# Final summary
# ============================================================
print("\n\n=== RÉSUMÉ FINAL ===")
total_remaining = 0
for root, dirs, files in os.walk(SRC_DIR):
    for f in files:
        if f.endswith('.tsx'):
            fp = os.path.join(root, f)
            urls = find_unsplash_urls(fp)
            if urls:
                print(f"  ⚠️  {f}: {len(urls)} Unsplash URLs restantes")
                total_remaining += len(urls)

if total_remaining == 0:
    print("  ✅ Toutes les images Unsplash ont été remplacées!")
else:
    print(f"\n  ⚠️  Total: {total_remaining} images Unsplash restantes")
