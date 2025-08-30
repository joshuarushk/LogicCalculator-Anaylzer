#!/usr/bin/env python3
"""
Modality Analyzer Desktop Application
A simple desktop wrapper for the web-based modality analyzer
"""

import os
import sys
import webbrowser
import threading
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler
import tkinter as tk
from tkinter import messagebox

class ModalityAnalyzerApp:
    def __init__(self):
        self.port = 8080
        self.server = None
        self.server_thread = None
        
    def find_available_port(self):
        """Find an available port starting from 8080"""
        import socket
        for port in range(8080, 8100):
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                    s.bind(('localhost', port))
                    self.port = port
                    return port
            except OSError:
                continue
        return 8080
    
    def start_server(self):
        """Start the HTTP server in a separate thread"""
        self.find_available_port()
        
        class QuietHTTPRequestHandler(SimpleHTTPRequestHandler):
            def log_message(self, format, *args):
                pass  # Suppress server logs
        
        try:
            self.server = HTTPServer(('localhost', self.port), QuietHTTPRequestHandler)
            self.server_thread = threading.Thread(target=self.server.serve_forever, daemon=True)
            self.server_thread.start()
            return True
        except Exception as e:
            print(f"Failed to start server: {e}")
            return False
    
    def stop_server(self):
        """Stop the HTTP server"""
        if self.server:
            self.server.shutdown()
            self.server.server_close()
    
    def open_browser(self):
        """Open the application in the default browser"""
        url = f"http://localhost:{self.port}"
        webbrowser.open(url)
    
    def create_gui(self):
        """Create a simple GUI window"""
        root = tk.Tk()
        root.title("Modality Analyzer")
        root.geometry("400x300")
        root.resizable(False, False)
        
        # Center the window
        root.eval('tk::PlaceWindow . center')
        
        # Main frame
        main_frame = tk.Frame(root, padx=20, pady=20)
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Title
        title_label = tk.Label(main_frame, text="Alethic Modality Analyzer", 
                              font=("Arial", 16, "bold"))
        title_label.pack(pady=(0, 10))
        
        # Description
        desc_label = tk.Label(main_frame, 
                             text="Analyze sentences for necessity, possibility, and impossibility",
                             font=("Arial", 10), wraplength=350)
        desc_label.pack(pady=(0, 20))
        
        # Status
        self.status_label = tk.Label(main_frame, text="Starting server...", 
                                    font=("Arial", 9), fg="blue")
        self.status_label.pack(pady=(0, 20))
        
        # Buttons frame
        buttons_frame = tk.Frame(main_frame)
        buttons_frame.pack(pady=10)
        
        # Launch button
        self.launch_button = tk.Button(buttons_frame, text="Launch Application", 
                                      command=self.launch_app, font=("Arial", 12),
                                      bg="#4CAF50", fg="white", padx=20, pady=10,
                                      state=tk.DISABLED)
        self.launch_button.pack(side=tk.LEFT, padx=(0, 10))
        
        # Exit button
        exit_button = tk.Button(buttons_frame, text="Exit", 
                               command=self.exit_app, font=("Arial", 12),
                               bg="#f44336", fg="white", padx=20, pady=10)
        exit_button.pack(side=tk.LEFT)
        
        # Info text
        info_text = tk.Text(main_frame, height=6, width=50, wrap=tk.WORD, 
                           font=("Arial", 8), bg="#f0f0f0")
        info_text.pack(pady=(20, 0), fill=tk.BOTH, expand=True)
        info_text.insert(tk.END, 
                        "Instructions:\n"
                        "1. Click 'Launch Application' to open the analyzer\n"
                        "2. The app will open in your default web browser\n"
                        "3. Enter sentences to analyze their modality\n"
                        "4. Keep this window open while using the app\n"
                        "5. Click 'Exit' to close the application")
        info_text.config(state=tk.DISABLED)
        
        # Start server after GUI is ready
        root.after(1000, self.initialize_server)
        
        # Handle window close
        root.protocol("WM_DELETE_WINDOW", self.exit_app)
        
        return root
    
    def initialize_server(self):
        """Initialize the server after GUI is ready"""
        if self.start_server():
            self.status_label.config(text=f"Server running on port {self.port}", fg="green")
            self.launch_button.config(state=tk.NORMAL)
        else:
            self.status_label.config(text="Failed to start server", fg="red")
            messagebox.showerror("Error", "Failed to start the web server")
    
    def launch_app(self):
        """Launch the application in browser"""
        self.open_browser()
        self.status_label.config(text="Application launched in browser", fg="green")
    
    def exit_app(self):
        """Exit the application"""
        self.stop_server()
        sys.exit(0)
    
    def run(self):
        """Run the desktop application"""
        # Change to the directory containing the web files
        script_dir = os.path.dirname(os.path.abspath(__file__))
        os.chdir(script_dir)
        
        # Create and run GUI
        root = self.create_gui()
        root.mainloop()

if __name__ == "__main__":
    app = ModalityAnalyzerApp()
    app.run()
