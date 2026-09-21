import os
import re

directories = [
    r'd:\Projects\Dauth\DeB-Auth-Service-Frontend\src\Sections\Landing',
    r'd:\Projects\Dauth\DeB-Auth-Service-Frontend\src\Pages'
]

replacements = [
    (r'\bbg-white\b', ''),
    (r'\bbg-\[\#f8fafc\]\b', ''),
    (r'\bbg-slate-50\b', ''),
    (r'\bbg-slate-100\b', ''),
    (r'\bborder-slate-\d+(\/\d+)?\b', ''),
    (r'\bborder-b\b', ''),
    (r'\bborder-t\b', ''),
    (r'\bborder\b', ''),
    (r'\bshadow-(sm|md|lg|xl)\b', 'neu-flat'),
    (r'\bshadow-slate-\d+(\/\d+)?\b', ''),
    (r'\bbackdrop-blur-(sm|md|lg|xl)\b', ''),
]

for d in directories:
    for root, _, files in os.walk(d):
        for file in files:
            if file.endswith('.jsx'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original = content
                for pattern, repl in replacements:
                    content = re.sub(pattern, repl, content)
                
                # Cleanup multiple spaces in className strings gently
                content = re.sub(r'className="\s+', 'className="', content)
                content = re.sub(r'\s+"', '"', content)
                
                if content != original:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f'Updated {file}')
