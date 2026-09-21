import os
import re

directory = r'd:\Projects\Dauth\DeB-Auth-Service-Frontend\src'

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith(('.jsx', '.tsx', '.js', '.ts')):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original = content
            # Fix `, : 'none'` -> `, border: 'none'`
            content = re.sub(r',\s*:\s*\'none\'', ', border: \'none\'', content)
            
            # Also what if it's the first element in the object? `{ : 'none' }`
            content = re.sub(r'{\s*:\s*\'none\'', '{ border: \'none\'', content)
            
            if content != original:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'Fixed {file}')
