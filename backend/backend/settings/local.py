from backend.settings.base import *

DEBUG = True

ALLOWED_HOSTS = [
    "0.0.0.0",
    "127.0.0.1",
    "localhost",
]

CORS_ORIGIN_WHITELIST = [
    "http://0.0.0.0:8080",
    "http://127.0.0.1:8080",
    "http://localhost:8080",
]
