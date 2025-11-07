"""
Webhook endpoints for external services
"""
from fastapi import APIRouter, Request

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])

@router.post("/payment/ecpay")
async def ecpay_webhook(request: Request):
    """ECPay payment webhook (Taiwan)"""
    pass

@router.post("/payment/omise")
async def omise_webhook(request: Request):
    """Omise payment webhook (Thailand)"""
    pass

@router.post("/payment/linepay")
async def linepay_webhook(request: Request):
    """LINE Pay webhook"""
    pass
