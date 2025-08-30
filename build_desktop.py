#!/usr/bin/env python3
"""
Build script for creating Windows executable of Modality Analyzer
"""

import os
import sys
import subprocess
import shutil

def run_command(cmd, description):
    """Run a command and handle errors"""
    print(f"\n{description}...")
    try:
        result = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
        print(f"✓ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ {description} failed:")
        print(f"Error: {e.stderr}")
        return False

def main():
    print("Building Modality Analyzer Desktop Application")
    print("=" * 50)
    
    # Check if Python is available
    try:
        import tkinter
        print("✓ Python with tkinter is available")
    except ImportError:
        print("✗ tkinter not available. Please install Python with tkinter support.")
        return False
    
    # Install PyInstaller if not available
    try:
        import PyInstaller
        print("✓ PyInstaller is available")
    except ImportError:
        print("Installing PyInstaller...")
        if not run_command("pip install pyinstaller", "Installing PyInstaller"):
            return False
    
    # Create the executable
    build_cmd = [
        "pyinstaller",
        "--onefile",
        "--windowed",
        "--name=ModalityAnalyzer",
        "--icon=assets/icon.ico" if os.path.exists("assets/icon.ico") else "",
        "--add-data=*.html;.",
        "--add-data=*.js;.",
        "--add-data=*.css;.",
        "--add-data=*.md;.",
        "app_launcher.py"
    ]
    
    # Remove empty icon parameter if no icon exists
    build_cmd = [arg for arg in build_cmd if arg]
    
    cmd_str = " ".join(build_cmd)
    
    if run_command(cmd_str, "Building Windows executable"):
        print("\n" + "=" * 50)
        print("✓ Build completed successfully!")
        print("\nYour executable is located at:")
        print("  dist/ModalityAnalyzer.exe")
        print("\nYou can now distribute this single .exe file to users.")
        print("No installation required - just run the .exe file!")
        return True
    else:
        return False

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)
