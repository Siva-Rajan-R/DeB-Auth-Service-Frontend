import os
import re

directory = r'd:\Projects\Dauth\DeB-Auth-Service-Frontend\src\Sections\Landing'

def replace_classes(match):
    cls = match.group(1)
    cls = re.sub(r'\bbg-white\b', '', cls)
    cls = re.sub(r'\bbg-\[\#f8fafc\]\b', '', cls)
    cls = re.sub(r'\bbg-slate-50\b', '', cls)
    cls = re.sub(r'\bbg-slate-100\b', '', cls)
    cls = re.sub(r'\bborder-slate-\d+(?:/\d+)?\b', '', cls)
    cls = re.sub(r'\bborder-[bt]\b', '', cls)
    cls = re.sub(r'\bborder\b', '', cls)
    cls = re.sub(r'\bshadow-(sm|md|lg|xl)\b', 'neu-flat', cls)
    cls = re.sub(r'\bshadow-slate-\d+(?:/\d+)?\b', '', cls)
    cls = re.sub(r'\bbackdrop-blur-(sm|md|lg|xl)\b', '', cls)
    cls = re.sub(r'\s{2,}', ' ', cls).strip()
    return f'className="{cls}"'

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.jsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original = content
            # ONLY replace inside className="..." strings
            content = re.sub(r'className="([^"]+)"', replace_classes, content)
            
            if content != original:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'Safely updated {file}')
