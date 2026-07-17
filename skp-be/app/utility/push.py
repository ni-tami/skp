"""Expo push notifications. Best-effort: logs failures, never raises."""

import logging
import httpx
from app.config import EXPO_ACCESS_TOKEN, EXPO_PUSH_URL

log = logging.getLogger("buddylocator.push")


def _headers():
    if not EXPO_ACCESS_TOKEN:
        return {}
    return {
        "Authorization": f"Bearer {EXPO_ACCESS_TOKEN}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }


async def send_push(
    to_tokens: list[str],
    title: str,
    body: str,
    data: dict | None = None,
    priority: str = "default",
    sound: str | None = None,
) -> None:
    if not to_tokens:
        return
    if not EXPO_ACCESS_TOKEN:
        log.warning("EXPO_ACCESS_TOKEN not set; skipping push (title=%s)", title)
        return
    messages = []
    for t in to_tokens:
        if not t:
            continue
        if not t.startswith("ExponentPushToken"):
            log.warning("invalid expo token format: %s", t)
            continue
        msg = {
            "to": t,
            "title": title,
            "body": body,
            "data": data or {},
            "priority": priority,
        }
        if sound:
            msg["sound"] = sound
        messages.append(msg)
    if not messages:
        return
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            res = await client.post(EXPO_PUSH_URL, json=messages, headers=_headers())
            if res.status_code >= 400:
                log.warning("expo push failed %s: %s", res.status_code, res.text)
    except Exception as e:
        log.warning("expo push error: %s", e)
