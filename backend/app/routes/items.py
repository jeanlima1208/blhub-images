from fastapi import APIRouter
from app.services.erpnext import get_items

router = APIRouter(prefix="/api/items", tags=["Items"])


@router.get("")
def items():
    return get_items()