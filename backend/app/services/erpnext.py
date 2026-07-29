import os
import requests
from dotenv import load_dotenv

load_dotenv()

ERP_URL = os.getenv("ERP_URL")
API_KEY = os.getenv("ERP_API_KEY")
API_SECRET = os.getenv("ERP_API_SECRET")

headers = {
    "Authorization": f"token {API_KEY}:{API_SECRET}"
}


def test_connection():
    r = requests.get(
        f"{ERP_URL}/api/resource/User?limit_page_length=1",
        headers=headers,
        timeout=15
    )

    return r.status_code, r.json()


def get_items():
    r = requests.get(
        f"{ERP_URL}/api/resource/Item?fields=[\"item_code\",\"item_name\",\"stock_uom\"]&limit_page_length=100",
        headers=headers,
        timeout=15
    )

    return r.json()