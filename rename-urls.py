#!/usr/bin/env python3
"""Remplace toutes les anciennes URLs par les nouvelles URLs SEO-friendly dans tous les fichiers TSX."""
import os
import re

# Mapping ancien → nouveau (ordre important : les plus longs d'abord pour éviter les remplacements partiels)
REPLACEMENTS = [
    # Routes longues d'abord
    ('/ecran-gonflable-geant', '/ecran-gonflable-geant-soufflerie'),
    ('/ecran-gonflable-etanche', '/ecran-gonflable-etanche-air'),
    ('/ecran-economique', '/ecran-gonflable-economique'),
    ('/tentes-araignees', '/tente-gonflable-araignee'),
    ('/tentes-x', '/tente-gonflable-x'),
    ('/tentes-n', '/tente-gonflable-n'),
    ('/tentes-v', '/tente-gonflable-v'),
    ('/arches-gonflables', '/arche-gonflable'),
    ('/demande-de-prix', '/tarifs-ecran-gonflable'),
    ('/notre-histoire', '/histoire-hallucine'),
    ('/a-propos', '/a-propos-hallucine'),
    ('/confidentialite', '/politique-confidentialite'),
    # Routes courtes ensuite (attention aux conflits)
    ('/accessoires', '/accessoire-cinema-plein-air'),
    ('/galerie', '/galerie-evenements'),
    ('/mobilier', '/mobilier-gonflable'),
    ('/contact', '/contactez-nous'),
    ('/ecrans', '/ecran-gonflable'),
    ('/tentes', '/tente-gonflable'),
]

# Répertoire source
SRC_DIR = '/home/ubuntu/hallucine-site/client/src'

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    changes = []
    
    for old, new in REPLACEMENTS:
        # On remplace uniquement dans les contextes href="..." ou path="..."
        # Pour éviter de casser des mots dans le texte
        # Pattern: le slug doit être suivi d'un " ou être exactement le path
        
        # Remplacement dans les href et path
        old_escaped = re.escape(old)
        
        # Pattern 1: href="/ancien" ou path="/ancien" (exact match, suivi de ")
        pattern1 = f'"{old_escaped}"'
        replace1 = f'"{new}"'
        if pattern1 in content:
            content = content.replace(pattern1, replace1)
            changes.append(f'  {old} → {new} (exact)')
        
        # Pattern 2: href="/ancien" dans un contexte avec des classes après
        # Ex: href="/ancien" className=...
        # Déjà couvert par le pattern 1
        
        # Pattern 3: dans les objets JS { href: "/ancien" }
        pattern3 = f'href: "{old}"'
        replace3 = f'href: "{new}"'
        if pattern3 in content:
            content = content.replace(pattern3, replace3)
            changes.append(f'  {old} → {new} (object)')
    
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f'✅ {os.path.relpath(filepath, SRC_DIR)}')
        for c in changes:
            print(c)
    
    return content != original

# Parcourir tous les fichiers TSX
count = 0
for root, dirs, files in os.walk(SRC_DIR):
    for f in sorted(files):
        if f.endswith('.tsx'):
            filepath = os.path.join(root, f)
            if process_file(filepath):
                count += 1

print(f'\n🔄 {count} fichiers modifiés')
