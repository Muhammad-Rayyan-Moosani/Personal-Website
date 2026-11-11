# ====================
# filename: contact.py
# ====================

"""
Contact form: visitors send Rayyan a message from the website, delivered to
his inbox by email through Resend's HTTPS API (no SMTP, which many hosts
block). The API key stays on the server.

Abuse controls: length limits, a hidden honeypot field that only bots fill,
and a per-visitor rate limit.
"""

import logging
import re
import time
from collections import defaultdict, deque
from typing import Deque, Dict, Optional

import httpx
from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel, Field, field_validator

from config import settings

logger = logging.getLogger(__name__)
router = APIRouter()

RESEND_URL = "https://api.resend.com/emails"
RATE_LIMIT = 5              # messages ...
RATE_WINDOW = 15 * 60       # ... per 15 minutes, per visitor
_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
_recent: Dict[str, Deque[float]] = defaultdict(deque)


class ContactRequest(BaseModel):
    """A message from the website's contact form."""

    name: str = Field(..., min_length=1, max_length=100)
    email: Optional[str] = Field(default=None, max_length=200, description="Optional, so Rayyan can reply")
    message: str = Field(..., min_length=1, max_length=4000)
    website: Optional[str] = Field(default=None, description="Honeypot: hidden from people, filled by bots")

    @field_validator("name", "message")
    @classmethod
    def not_blank(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("must not be blank")
        return v

    @field_validator("email")
    @classmethod
    def valid_email(cls, v: Optional[str]) -> Optional[str]:
        v = (v or "").strip()
        if not v:
            return None
        if not _EMAIL_RE.match(v):
            raise ValueError("not a valid email address")
        return v


def _client_ip(request: Request) -> str:
    """The visitor's IP (Render puts it first in X-Forwarded-For)."""
    forwarded = request.headers.get("x-forwarded-for", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _rate_limited(ip: str) -> bool:
    now = time.monotonic()
    hits = _recent[ip]
    while hits and now - hits[0] > RATE_WINDOW:
        hits.popleft()
    if len(hits) >= RATE_LIMIT:
        return True
    hits.append(now)
    return False


@router.post("/contact", summary="Send Rayyan a message", tags=["Contact"])
async def contact(body: ContactRequest, request: Request) -> Dict[str, str]:
    """Email a visitor's message to Rayyan."""
    # Bots fill every field, including the hidden one. Pretend it worked.
    if body.website:
        return {"status": "sent"}

    if not settings.resend_api_key:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="The contact form isn't set up yet.",
        )

    if _rate_limited(_client_ip(request)):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many messages. Please try again later.",
        )

    name = " ".join(body.name.split())  # no line breaks in the subject
    sender = f"{name} <{body.email}>" if body.email else f"{name} (no email given)"
    payload = {
        "from": settings.contact_from,
        "to": [settings.contact_to_email],
        "subject": f"Portfolio message from {name}",
        "text": f"From: {sender}\n\n{body.message}\n\n— Sent from the contact form on rayyanmoosani.com",
    }
    if body.email:
        payload["reply_to"] = body.email  # hitting Reply goes straight to the visitor

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            res = await client.post(
                RESEND_URL,
                headers={"Authorization": f"Bearer {settings.resend_api_key}"},
                json=payload,
            )
    except httpx.HTTPError as e:
        logger.error(f"Contact email failed to send: {type(e).__name__}")
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Couldn't send the message.")

    if res.status_code >= 300:
        # Log the provider's status only — never the visitor's message or address.
        logger.error(f"Contact email rejected by Resend: HTTP {res.status_code}")
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Couldn't send the message.")

    logger.info("Contact message delivered")
    return {"status": "sent"}
