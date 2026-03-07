from fastapi import APIRouter, HTTPException, Depends
from ..dependencies import get_current_user
from ..models import User
import subprocess
import sys
from pathlib import Path

router = APIRouter(prefix="/admin", tags=["admin"])

SYNC_SCRIPT = Path(__file__).resolve().parent.parent.parent.parent / "sync_from_db.py"


@router.post("/sync")
def sync_to_local(current_user: User = Depends(get_current_user)):
    if current_user.is_demo:
        raise HTTPException(status_code=403, detail="Not allowed for demo users")

    if not SYNC_SCRIPT.exists():
        raise HTTPException(
            status_code=404, detail=f"sync_from_db.py not found at {SYNC_SCRIPT}"
        )

    try:
        result = subprocess.run(
            [sys.executable, str(SYNC_SCRIPT)],
            capture_output=True,
            text=True,
            timeout=30,
        )
        if result.returncode != 0:
            raise HTTPException(status_code=500, detail=result.stderr)

        return {"ok": True, "output": result.stdout}

    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=504, detail="Sync timeout")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
