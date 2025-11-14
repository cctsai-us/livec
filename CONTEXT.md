**YOU ARE NOT ALLOWED TO MAKE ANY CHANGES WITHOUT MY APPROVAL.**

## User's Cloudflare Credentials

**IMPORTANT**: User has completed Cloudflare setup (Step #1)

```bash
Account ID: 0255752a1330b55dad31441eb3626295
API Token: iHCD7pgd-wsNKuZO-XT-iS2iaO4MD1NqXdJ8y91L
# Customer Code: (to be obtained from dashboard)
```

These credentials are referenced in [START_HERE.md](START_HERE.md) lines 60-62.

---

## Running the API Server

**Backend API** (from `backend/` directory):
```bash
cd ~/Documents/dev/live_commerce/backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Or simply:
```bash
python -m uvicorn app.main:app --reload
```

---

### Social Login Providers by Market
**Taiwan**:
- LINE (primary)
- Facebook
- Instagram
- Google
- Apple

**Thailand**:
- Facebook (primary)
- LINE
- Google
- Apple
- Kapook (placeholder - research needed)

---
