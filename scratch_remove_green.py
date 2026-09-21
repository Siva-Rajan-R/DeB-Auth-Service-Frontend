import os
import re

directory = r'd:\Projects\Dauth\DeB-Auth-Service-Frontend\src'

replacements = [
    (r'\bemerald-600\b', 'blue-600'),
    (r'\bemerald-500\b', 'blue-500'),
    (r'\bemerald-400\b', 'blue-400'),
    (r'\bemerald-700\b', 'blue-700'),
    (r'\bemerald-800\b', 'blue-800'),
    (r'\bemerald-100\b', 'blue-100'),
    (r'\bemerald-50\b', 'blue-50'),
    (r'\bteal-600\b', 'indigo-600'),
    (r'\bteal-500\b', 'indigo-500'),
    (r'\bteal-400\b', 'indigo-400'),
    (r'\bteal-300\b', 'indigo-300'),
    (r'\bteal-200\b', 'indigo-200'),
    (r'\bgreen-400\b', 'blue-500'),
    (r'\bgreen-500\b', 'blue-500'),
    (r'\bgreen-600\b', 'blue-600'),
]

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith(('.jsx', '.tsx', '.js', '.ts', '.css')):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original = content
            for pattern, repl in replacements:
                content = re.sub(pattern, repl, content)
            
            if content != original:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'Purged green from {file}')
