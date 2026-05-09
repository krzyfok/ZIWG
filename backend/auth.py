import binascii
import hashlib
import os

HASH_NAME = "sha256"
ITERATIONS = 100_000
SALT_SIZE = 16


def hash_password(password: str) -> tuple[str, str]:
    """
    Generate hash and salt for provided password.

    :param password: plain text password
    :return: tuple of salt and hash in hexadecimal format
    """
    salt = os.urandom(SALT_SIZE)
    hash_bytes = hashlib.pbkdf2_hmac(
        HASH_NAME, password.encode("utf-8"), salt, ITERATIONS
    )
    return binascii.hexlify(salt).decode("ascii"), binascii.hexlify(hash_bytes).decode(
        "ascii"
    )


def verify_password(password: str, salt_hex: str, hashed_password: str) -> bool:
    """
    Verify if provided password matches the hash.

    :param password: plain text password to verify
    :param salt_hex: salt used for hashing (hexadecimal string)
    :param hashed_password: expected hash (hexadecimal string)
    :return: True if password is correct, False otherwise
    """
    salt = binascii.unhexlify(salt_hex.encode("ascii"))
    hash_bytes = hashlib.pbkdf2_hmac(
        HASH_NAME, password.encode("utf-8"), salt, ITERATIONS
    )
    return binascii.hexlify(hash_bytes).decode("ascii") == hashed_password
