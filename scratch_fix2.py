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
            # Fix var(---glass)
            content = re.sub(r'var\(---', r'var(--border-', content)
            
            # Fix orphaned colons in object properties
            content = re.sub(r'([,{]\s*):\s*([\'"])', r'\1border: \2', content)
            content = re.sub(r'(\n\s*):\s*([\'"])', r'\1border: \2', content)
            
            # Fix broken classNames like `-[var(--border-glass)]` back to `border-[var(--border-glass)]`
            content = re.sub(r'(?<![a-zA-Z0-9])-\[var\(--border-', r'border-[var(--border-', content)
            
            if content != original:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'Repaired {file}')
