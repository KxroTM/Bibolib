from datetime import datetime, timedelta
from app import app
from models import db
from sqlalchemy import text

def purge_expired_reservations():
    import requests
    with app.app_context():
        now = datetime.utcnow()
        where_clause = "due_date < :now AND status IN ('pre_reserved', 'borrowed')"
        candidates = db.session.execute(text(f'''
            SELECT id, due_date, status FROM reservations
            WHERE {where_clause}
        '''), {'now': now}).fetchall()
        try:
            log_payload = {
                "status": "success",
                "count": result.rowcount,
                "details": f"{result.rowcount} réservations annulées à {now}",
                "module": "cron",
                "action": "PURGE_RESERVATIONS",
                "timestamp": str(now),
                "candidates": [dict(id=row.id, due_date=str(row.due_date), status=row.status) for row in candidates]
            }
            requests.post("http://activity_logs:8080/cron/purge-reservations", json=log_payload, timeout=5)
        except Exception as e:
            pass
                "details": f"{result.rowcount} réservations annulées à {now}",
                "meta": {
                    "candidates": [
                        {"id": row.id, "due_date": str(row.due_date), "status": row.status} for row in candidates
                    ],
                    "timestamp": str(now)
                }
            }
            # Adapter l'URL si besoin (localhost ou nom du service docker)
            requests.post("http://activity_logs:8080/cron/purge-reservations", json=log_payload, timeout=3)
        except Exception as e:
            f.write(f"[ERROR] Could not send cron log: {e}\n")

if __name__ == "__main__":
    purge_expired_reservations()
