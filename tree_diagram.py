import os

# List of directories to exclude
EXCLUDE_DIRS = {'.vscode', 'node_modules', 'theme', 'venv', '__pycache__', 'migrations', '.git'}

def print_tree(directory, prefix=''):
    """Recursively print the directory structure, excluding specified directories."""
    # List the directory contents
    items = os.listdir(directory)
    items.sort()  # Sort alphabetically
    last_item = items[-1] if items else None

    # Loop over all items in the directory
    for item in items:
        path = os.path.join(directory, item)

        # Skip directories in the exclusion list
        if item in EXCLUDE_DIRS:
            continue

        if item == last_item:
            print(f"{prefix}└── {item}")
            new_prefix = prefix + "    "
        else:
            print(f"{prefix}├── {item}")
            new_prefix = prefix + "│   "

        # If the item is a directory, recursively call print_tree
        if os.path.isdir(path):
            print_tree(path, new_prefix)

if __name__ == "__main__":
    # Get the directory you want to print the tree for (can also be passed as an argument)
    project_root = "."  # or replace with the root directory path of your project
    print(f"Project Tree for: {os.path.abspath(project_root)}")
    print_tree(project_root)
