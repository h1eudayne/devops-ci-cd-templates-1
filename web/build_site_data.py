import os
import json
import shutil
import re
import urllib.parse

# Set paths relative to script location
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__)) # web/
REPO_ROOT = os.path.dirname(SCRIPT_DIR)                 # repo root

PUBLIC_IMAGES_DIR = os.path.join(SCRIPT_DIR, 'public', 'images')
DATA_JSON_PATH = os.path.join(SCRIPT_DIR, 'src', 'data.json')

# Ensure clean public/images directory
if os.path.exists(PUBLIC_IMAGES_DIR):
    shutil.rmtree(PUBLIC_IMAGES_DIR)
os.makedirs(PUBLIC_IMAGES_DIR, exist_ok=True)

# List of folders to ignore during repo crawl
IGNORE_DIRS = {
    'node_modules', '.git', '.github', '.venv', '__pycache__', 
    '.gemini', 'web', 'images', 'dist', 'build', '.idea', '.vscode'
}

# Supported categories at root level
CATEGORIES = ['system-design', 'roadmap', 'on-premise', 'cloud', 'pipelines', 'dockerfiles', 'docs']

def get_clean_title(content, default_name):
    """Extracts heading from markdown or uses filename as fallback"""
    lines = content.split('\n')
    for i, line in enumerate(lines[:5]):
        line = line.strip()
        if line.startswith('#'):
            return line.lstrip('# ').strip()
        # Check for underline heading (=== or ---)
        if i < len(lines) - 1 and (lines[i+1].strip().startswith('===') or lines[i+1].strip().startswith('---')) and len(line) > 0:
            return line
    return default_name

def process_markdown_file(abs_path, rel_path):
    """Reads markdown file, copies referenced images, and adjusts links"""
    md_dir = os.path.dirname(abs_path)
    md_rel_dir = os.path.dirname(rel_path).replace('\\', '/')
    
    with open(abs_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    title = get_clean_title(content, os.path.basename(rel_path))
    
    # Process images: find all ![alt](src)
    def replace_img(match):
        alt = match.group(1)
        src = match.group(2).strip()
        
        # Skip external links
        if src.startswith(('http://', 'https://', 'data:')):
            return f"![{alt}]({src})"
        
        # Resolve path
        # Normalize and find actual path on disk
        img_abs_path = os.path.normpath(os.path.join(md_dir, src))
        
        if os.path.exists(img_abs_path) and os.path.isfile(img_abs_path):
            # Target path under public/images/<rel_dir>/<src>
            img_rel_to_root = os.path.relpath(img_abs_path, REPO_ROOT).replace('\\', '/')
            # Create same directory structure under public/images
            target_abs_path = os.path.normpath(os.path.join(PUBLIC_IMAGES_DIR, img_rel_to_root))
            os.makedirs(os.path.dirname(target_abs_path), exist_ok=True)
            
            # Copy file
            shutil.copy2(img_abs_path, target_abs_path)
            
            # Web path will be /images/<img_rel_to_root>
            # URL encode each part to handle spaces
            parts = img_rel_to_root.split('/')
            encoded_parts = [urllib.parse.quote(part) for part in parts]
            web_path = '/images/' + '/'.join(encoded_parts)
            return f"![{alt}]({web_path})"
        else:
            print(f"Warning: Image not found: {img_abs_path} (referenced in {rel_path})")
            return f"![{alt}]({src})"
            
    # Sub matches
    content_adjusted = re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', replace_img, content)
    return title, content_adjusted

def build_tree():
    """Crawl repo, process files, and build tree and content indices"""
    docs_db = {}
    
    # We will build a tree node for each category
    tree_data = []
    
    for category in CATEGORIES:
        category_abs_path = os.path.join(REPO_ROOT, category)
        if not os.path.exists(category_abs_path) or not os.path.isdir(category_abs_path):
            continue
            
        # Recursive walk to build the node structure
        def walk_dir(current_abs, current_rel):
            dir_node = {
                "name": os.path.basename(current_abs),
                "path": current_rel.replace('\\', '/'),
                "type": "directory",
                "children": []
            }
            
            # Sort items to keep chapters/folders ordered
            items = sorted(os.listdir(current_abs))
            
            for item in items:
                item_abs = os.path.join(current_abs, item)
                item_rel = os.path.relpath(item_abs, REPO_ROOT)
                item_rel_unix = item_rel.replace('\\', '/')
                
                if os.path.isdir(item_abs):
                    if item not in IGNORE_DIRS:
                        child_node = walk_dir(item_abs, item_rel)
                        # Only add folder if it contains markdown files or other populated subfolders
                        if child_node["children"]:
                            dir_node["children"].append(child_node)
                elif item_abs.endswith('.md'):
                    title, content = process_markdown_file(item_abs, item_rel)
                    docs_db[item_rel_unix] = {
                        "title": title,
                        "content": content
                    }
                    dir_node["children"].append({
                        "name": item,
                        "title": title,
                        "path": item_rel_unix,
                        "type": "file"
                    })
                    
            # Sort children: directories first, then files
            dir_node["children"].sort(key=lambda x: (0 if x["type"] == "directory" else 1, x["name"]))
            return dir_node
            
        cat_tree = walk_dir(category_abs_path, category)
        # Simplify category names for display
        display_names = {
            'system-design': 'Thiết Kế Hệ Thống',
            'roadmap': 'Lộ Trình Học Tập (Roadmaps)',
            'on-premise': 'Hạ Tầng On-Premise',
            'cloud': 'Điện Toán Đám Mây (Cloud)',
            'pipelines': 'Mẫu CI/CD Pipelines',
            'dockerfiles': 'Mẫu Dockerfile Templates',
            'docs': 'Tài Liệu Hướng Dẫn'
        }
        cat_tree["displayName"] = display_names.get(category, category)
        
        if cat_tree["children"]:
            tree_data.append(cat_tree)
            
    # Load Glossary from glossary.js if available, otherwise write empty glossary
    # In D:\Code\System_Design_De\glossary.js, there is const GLOSSARY_DATA = { ... }
    glossary = {}
    glossary_src = os.path.join(REPO_ROOT, 'system-design', 'Alex-Xu-System-Design-Interview', 'glossary.js')
    # If not found there, check source folder
    if not os.path.exists(glossary_src):
        glossary_src = r'D:\Code\System_Design_De\glossary.js'
        
    if os.path.exists(glossary_src):
        try:
            with open(glossary_src, 'r', encoding='utf-8') as f:
                gl_content = f.read()
                # Simple extraction of json-like structure from js file
                match = re.search(r'const\s+GLOSSARY_DATA\s*=\s*(\{.*?\});', gl_content, re.DOTALL)
                if match:
                    # Parse using a safer method or json load
                    # Since it is JS object, replace single quotes and handle format to valid JSON
                    js_obj = match.group(1)
                    # Convert JS object formatting to JSON
                    # A quick approximation: convert keys to double quotes
                    json_str = re.sub(r"([a-zA-Z0-9_]+)\s*:", r'"\1":', js_obj)
                    json_str = json_str.replace("'", '"')
                    # Strip trailing commas before closing braces
                    json_str = re.sub(r',\s*\}', '}', json_str)
                    json_str = re.sub(r',\s*\]', ']', json_str)
                    glossary = json.loads(json_str)
                    print(f"Glossary loaded successfully: {len(glossary)} terms")
        except Exception as e:
            print(f"Warning: Could not parse glossary.js: {e}")
            
    # Combine database
    output_data = {
        "tree": tree_data,
        "docs": docs_db,
        "glossary": glossary
    }
    
    # Save to src/data.json
    os.makedirs(os.path.dirname(DATA_JSON_PATH), exist_ok=True)
    with open(DATA_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully compiled repository data into {DATA_JSON_PATH}!")
    print(f"Processed {len(docs_db)} markdown documents.")

if __name__ == '__main__':
    build_tree()
