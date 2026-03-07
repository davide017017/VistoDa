#!/usr/bin/env python3
"""
sync_from_db.py
---------------
Scarica tutti i media dell'utente admin dal DB e aggiorna i JSON locali
in backend/app/data/admin/ suddivisi per tipo.

Uso:
    python sync_from_db.py

Richiede:
    - backend/.env con DATABASE_URL
    - psycopg2-binary installato nel venv
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime


# -- Carica .env manualmente (senza dipendenze extra) --------------------------
def load_env(env_path: Path):
    if not env_path.exists():
        print(f"ERRORE: File .env non trovato in {env_path}")
        sys.exit(1)
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


# -- Paths ---------------------------------------------------------------------
ROOT = Path(__file__).resolve().parent
ENV_PATH = ROOT / "backend" / ".env"
DATA_DIR = ROOT / "backend" / "app" / "data" / "admin"

load_env(ENV_PATH)

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    print("ERRORE: DATABASE_URL non trovata nel .env")
    sys.exit(1)

# -- Connessione DB ------------------------------------------------------------
try:
    import psycopg2
    import psycopg2.extras
except ImportError:
    print("ERRORE: psycopg2 non installato. Runna: pip install psycopg2-binary")
    sys.exit(1)

print("Connessione al DB...")
try:
    conn = psycopg2.connect(DATABASE_URL, connect_timeout=10)
except Exception as e:
    print(f"ERRORE: Connessione fallita: {e}")
    sys.exit(1)

# -- Fetch utente admin --------------------------------------------------------
with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
    cur.execute("SELECT id, email, nickname FROM users WHERE is_demo = FALSE LIMIT 1")
    admin = cur.fetchone()

if not admin:
    print("ERRORE: Nessun utente admin trovato nel DB")
    conn.close()
    sys.exit(1)

print(f"Admin trovato: {admin['nickname']} ({admin['email']})")

# -- Fetch media ---------------------------------------------------------------
with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
    cur.execute(
        """
        SELECT title, type, status, year, rating, notes, updated_at
        FROM media
        WHERE user_id = %s
        ORDER BY updated_at ASC NULLS FIRST
        """,
        (admin["id"],),
    )
    rows = cur.fetchall()

conn.close()
print(f"Media trovati: {len(rows)}")


# -- Serializza ----------------------------------------------------------------
def serialize(row):
    return {
        "title": row["title"],
        "type": row["type"],
        "status": row["status"],
        "year": row["year"],
        "rating": float(row["rating"]) if row["rating"] is not None else None,
        "notes": row["notes"],
        "updated_at": (
            row["updated_at"].strftime("%Y-%m-%dT%H:%M:%S")
            if row["updated_at"]
            else None
        ),
    }


buckets = {"film": [], "serie": [], "anime": [], "standup": []}
skipped = 0
for row in rows:
    t = row["type"]
    if t in buckets:
        buckets[t].append(serialize(row))
    else:
        skipped += 1
        print(f"  SKIP: Tipo sconosciuto '{t}' per '{row['title']}'")

# -- Scrivi JSON ---------------------------------------------------------------
DATA_DIR.mkdir(parents=True, exist_ok=True)

for type_name, items in buckets.items():
    out_path = DATA_DIR / f"seed_media_{type_name}.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
    print(f"  OK {out_path.name}: {len(items)} voci")

# -- Summary -------------------------------------------------------------------
total = sum(len(v) for v in buckets.values())
print(f"\nSync completata -- {total} media salvati in {DATA_DIR}")
print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
if skipped:
    print(f"ATTENZIONE: {skipped} voci skippate (tipo sconosciuto)")
