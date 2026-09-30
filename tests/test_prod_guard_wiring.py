"""The prod guard sits in front of the --local Postgres read in scripts/00_export_snapshot.py.

`--local` connects to --dsn, DATABASE_URL or localhost:5432 -- a `fly proxy`
tunnel to production when one is open. These tests fake a flyctl listener and
assert nothing connects. The default path (`flyctl postgres connect`) is an
intentional prod read and stays unguarded.
"""

import importlib.util
import sys
from pathlib import Path

import pytest

SCRIPTS = Path(__file__).resolve().parent.parent / "scripts"
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))

import prod_guard  # noqa: E402

psycopg2 = pytest.importorskip("psycopg2")

_spec = importlib.util.spec_from_file_location("export_snapshot", SCRIPTS / "00_export_snapshot.py")
export_snapshot = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(export_snapshot)


@pytest.fixture
def fly_tunnel(monkeypatch):
    for var in ("ALLOW_PROD_DB", "PGHOST", "PGPORT"):
        monkeypatch.delenv(var, raising=False)
    seen = []
    monkeypatch.setattr(prod_guard, "_listener", lambda port: seen.append(port) or "flyctl")
    monkeypatch.setattr(psycopg2, "connect", lambda *a, **kw: pytest.fail("connected"))
    return seen


def test_local_dsn_refuses_fly_tunnel(fly_tunnel):
    with pytest.raises(prod_guard.ProdDatabaseError):
        export_snapshot._make_query(local_dsn="postgresql://localhost:5432/db")
    assert fly_tunnel == [5432]


def test_default_flyctl_path_is_not_guarded(fly_tunnel):
    query = export_snapshot._make_query()
    query.close()
    assert fly_tunnel == []
