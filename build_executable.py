"""
Script to build a standalone executable from the modality analyzer desktop app.
Uses PyInstaller to create a single executable file.
"""

import subprocess
import sys
import os

def install_pyinstaller():
    """Install PyInstaller if not already installed."""
    try:
        import PyInstaller
        print("PyInstaller is already installed.")
    except ImportError:
        print("Installing PyInstaller...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pyinstaller"])
        print("PyInstaller installed successfully.")

def build_executable():
    """Build the executable using PyInstaller."""
    
    # PyInstaller command
    cmd = [
        "pyinstaller",
        "--onefile",  # Create a single executable file
        "--windowed",  # Hide console window (for GUI apps)
        "--name=ModalityAnalyzer",  # Name of the executable
        "--icon=assets/icon.ico",  # App icon (if exists)
        "modality_analyzer_desktop.py"
    ]
    
    print("Building executable...")
    print(f"Command: {' '.join(cmd)}")
    
    try:
        subprocess.run(cmd, check=True)
        print("\n✅ Executable built successfully!")
        print("📁 Location: dist/ModalityAnalyzer.exe")
        print("\nYou can now run the desktop app by double-clicking ModalityAnalyzer.exe")
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error building executable: {e}")
        return False
    except FileNotFoundError:
        print("❌ PyInstaller not found. Installing...")
        install_pyinstaller()
        return build_executable()  # Retry after installation
    
    return True

if __name__ == "__main__":
    print("🔨 Modality Analyzer - Executable Builder")
    print("=" * 50)
    
    # Check if source file exists
    if not os.path.exists("modality_analyzer_desktop.py"):
        print("❌ Error: modality_analyzer_desktop.py not found!")
        sys.exit(1)
    
    # Install PyInstaller if needed
    install_pyinstaller()
    
    # Build the executable
    success = build_executable()
    
    if success:
        print("\n🎉 Build completed successfully!")
        print("Your desktop modality analyzer is ready to use!")
    else:
        print("\n❌ Build failed. Please check the error messages above.")
