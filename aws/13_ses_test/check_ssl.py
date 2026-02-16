import sys
import os

print(f"Python Executable: {sys.executable}")
print(f"Python Version: {sys.version}")

try:
    import ssl
    print(f"SSL Module found. OpenSSL version: {ssl.OPENSSL_VERSION}")
except ImportError as e:
    print(f"Error importing ssl: {e}")
except Exception as e:
    print(f"An error occurred: {e}")
