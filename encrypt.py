# from cryptography.fernet import Fernet

# def generate_key():
#     return Fernet.generate_key()

# def encrypt_string(plaintext, key):
#     cipher_suite = Fernet(key)
#     encrypted_text = cipher_suite.encrypt(plaintext.encode('utf-8'))
#     return encrypted_text

# # Example usage
# plaintext = "UMANG_690"
# key = generate_key()
# encrypted_string = encrypt_string(plaintext, key)
# print("Encrypted string:", encrypted_string)

import hashlib

def hash_string(input_string):
    # Use SHA-256 hashing algorithm
    hash_object = hashlib.sha256(input_string.encode())
    # Take the hexadecimal digest and get the first 16 characters
    hashed_string = hash_object.hexdigest()[:16]
    return hashed_string

# Example usage
plaintext = "UMANG_690"
encrypted_string = hash_string(plaintext)
print("Encrypted string:", encrypted_string)
