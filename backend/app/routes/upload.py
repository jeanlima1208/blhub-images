from fastapi import APIRouter, UploadFile, File, Form
from app.services.github_images import upload_image
import requests
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(tags=["Upload"])

ERP_URL = os.getenv("ERP_URL")
API_KEY = os.getenv("ERP_API_KEY")
API_SECRET = os.getenv("ERP_API_SECRET")


@router.post("/upload-image")
async def upload(
    item_code: str = Form(...),
    file: UploadFile = File(...)
):
    content = await file.read()

    url = upload_image(
        content,
        file.filename
    )

    headers = {
        "Authorization": f"token {API_KEY}:{API_SECRET}",
        "Content-Type": "application/json",
    }

    requests.put(
        f"{ERP_URL}/api/resource/Item/{item_code}",
        headers=headers,
        json={
            "image": url
        },
        timeout=30,
    )

    return {
        "url": url
    }