import os

files_to_check = [
    "index.html",
    "sitemap.xml",
    "robots.txt",
    "main.js",
    "README.md",
    "CNAME",
    "content.js"
]

for filepath in files_to_check:
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r') as f:
        content = f.read()

    # URL replacements
    content = content.replace("https://date.alectronic.co", "https://date.alec.today")
    content = content.replace("date.alectronic.co", "date.alec.today")
    
    # Email replacements
    content = content.replace("date.alec@alectronic.co.uk", "date@alec.today")

    # Linktree removal in content.js
    if filepath == "content.js":
        # We need to remove the lines for Linktree
        lines = content.split('\n')
        new_lines = []
        skip = False
        for line in lines:
            if 'label: "Linktree"' in line:
                # Remove the preceding line if it was just a `{`
                if new_lines and new_lines[-1].strip() == '{':
                    new_lines.pop()
                skip = True
                continue
            if skip:
                if '},' in line:
                    skip = False
                continue
            new_lines.append(line)
        content = '\n'.join(new_lines)

    # Linktree removal in README.md
    if filepath == "README.md":
        content = content.replace("Linktree, Instagram", "Instagram")
        content = content.replace("[Linktree](https://linktr.ee/Alectronic), ", "")

    with open(filepath, 'w') as f:
        f.write(content)
