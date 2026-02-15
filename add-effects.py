#!/usr/bin/env python3
"""
Ajoute les effets visuels thématiques dans les hero sections de chaque page.
"""
import re

PAGES_DIR = "/home/ubuntu/hallucine-site/client/src/pages"

# Mapping: fichier -> (import_line, component_to_insert, insert_after_pattern)
effects = {
    # Tentes: WeatherEffect (pluie/vent)
    "TentesX.tsx": ("WeatherEffect", 'import WeatherEffect from "@/components/WeatherEffect";'),
    "TentesN.tsx": ("WeatherEffect", 'import WeatherEffect from "@/components/WeatherEffect";'),
    "TentesV.tsx": ("WeatherEffect", 'import WeatherEffect from "@/components/WeatherEffect";'),
    "TentesAraignees.tsx": ("WeatherEffect", 'import WeatherEffect from "@/components/WeatherEffect";'),
    "Tentes.tsx": ("WeatherEffect", 'import WeatherEffect from "@/components/WeatherEffect";'),
    # Arches: ConfettiEffect
    "ArchesGonflables.tsx": ("ConfettiEffect", 'import ConfettiEffect from "@/components/ConfettiEffect";'),
    # Mobilier: BokehEffect
    "Mobilier.tsx": ("BokehEffect", 'import BokehEffect from "@/components/BokehEffect";'),
    # Accessoires: StarsEffect
    "Accessoires.tsx": ("StarsEffect", 'import StarsEffect from "@/components/StarsEffect";'),
    # Galerie: FlashEffect
    "Galerie.tsx": ("FlashEffect", 'import FlashEffect from "@/components/FlashEffect";'),
    # Mode d'emploi: GearsEffect
    "ModeEmploi.tsx": ("GearsEffect", 'import GearsEffect from "@/components/GearsEffect";'),
}

for filename, (component_name, import_line) in effects.items():
    filepath = f"{PAGES_DIR}/{filename}"
    try:
        with open(filepath, 'r') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"SKIP: {filename} not found")
        continue

    # Skip if already has the effect
    if component_name in content:
        print(f"SKIP: {filename} already has {component_name}")
        continue

    # Add import after last import line
    lines = content.split('\n')
    last_import_idx = 0
    for i, line in enumerate(lines):
        if line.strip().startswith('import '):
            last_import_idx = i
    
    lines.insert(last_import_idx + 1, import_line)
    content = '\n'.join(lines)

    # Find the first <section and make it relative + overflow-hidden, then add the component inside
    # Strategy: find first <section, add relative overflow-hidden, add component as first child
    
    # For hero sections, we need to wrap the section content
    first_section = re.search(r'(<section\s+className=")', content)
    if first_section:
        pos = first_section.start()
        # Check if already has 'relative'
        section_match = re.search(r'<section\s+className="([^"]*)"', content[pos:])
        if section_match:
            existing_classes = section_match.group(1)
            if 'relative' not in existing_classes:
                new_classes = 'relative overflow-hidden ' + existing_classes
            else:
                new_classes = existing_classes
                if 'overflow-hidden' not in existing_classes:
                    new_classes = existing_classes + ' overflow-hidden'
            
            # Replace the section opening
            old_section = f'<section className="{existing_classes}">'
            new_section = f'<section className="{new_classes}">'
            content = content.replace(old_section, new_section, 1)
            
            # Add component right after the section opening tag
            component_tag = f"<{component_name} />"
            if component_name == "WeatherEffect":
                component_tag = f'<{component_name} intensity="moderate" />'
            
            content = content.replace(new_section, new_section + f"\n        {component_tag}", 1)
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"OK: {filename} -> {component_name}")

print("\nDone!")
