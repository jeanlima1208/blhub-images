import requests
import base64
import os
from dotenv import load_dotenv


load_dotenv()


GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

OWNER = "jeanlima1208"
REPO = "blhub-images"
BRANCH = "main"


def upload_image(file_bytes, filename):

    if not GITHUB_TOKEN:
        raise Exception("GITHUB_TOKEN não encontrado no .env")

    # remove espaços e caracteres problemáticos
    filename = filename.replace(" ", "-")

    content = base64.b64encode(file_bytes).decode("utf-8")

    path = f"products/{filename}"

    url = (
        f"https://api.github.com/repos/"
        f"{OWNER}/{REPO}/contents/{path}"
    )

    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json"
    }

    data = {
        "message": f"upload {filename}",
        "content": content,
        "branch": BRANCH
    }

    response = requests.put(
        url,
        headers=headers,
        json=data
    )

    if response.status_code not in [200, 201]:
        raise Exception(
            f"Erro GitHub: {response.status_code} - {response.text}"
        )

    return (
        f"https://raw.githubusercontent.com/"
        f"{OWNER}/{REPO}/{BRANCH}/{path}"
    )