#!/usr/bin/env python3
import argparse
import json
import os
import re
import subprocess
import unicodedata
from collections import defaultdict
from pathlib import Path


HERE = Path(__file__).resolve().parent


def norm(value):
    if value is None:
        return None
    text = unicodedata.normalize("NFKC", str(value)).strip()
    text = re.sub(r"\s+", " ", text)
    return text or None


def key(value):
    text = norm(value)
    return text.casefold() if text else None


def bridge(payload):
    env = os.environ.copy()
    env["CLEANUP_PAYLOAD"] = json.dumps(payload, ensure_ascii=False)
    proc = subprocess.run(
        ["node", "db_cleanup_bridge.js"],
        cwd=HERE,
        env=env,
        capture_output=True,
        text=True,
    )
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr.strip() or proc.stdout.strip() or "bridge failed")
    return json.loads(proc.stdout or "{}")


def rows(sql, params=None):
    return bridge({"kind": "query", "sql": sql, "params": params or []})["rows"]


def update_sql(table, row_id, updates):
    cols = list(updates)
    sets = ", ".join(f"{c} = ${i + 1}" for i, c in enumerate(cols))
    params = [updates[c] for c in cols] + [row_id]
    return {"sql": f"UPDATE {table} SET {sets} WHERE id = ${len(params)}", "params": params}


def dup_report(items, field):
    groups = defaultdict(list)
    for row in items:
        groups[key(row.get(field))].append(row)
    out = []
    for k, vals in groups.items():
        if k and len(vals) > 1:
            ids = [v["id"] for v in vals]
            out.append({"key": k, "ids": ids, "keep_id": min(ids), "count": len(ids)})
    return sorted(out, key=lambda x: x["keep_id"])


def trim_row(row, fields):
    updates = {}
    for field in fields:
        cleaned = norm(row.get(field))
        if cleaned is not None and cleaned != row.get(field):
            updates[field] = cleaned
    return updates


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    tables = {
        "prestataires": rows("SELECT id, nom, metier, telephone FROM prestataires ORDER BY id"),
        "providers": rows("SELECT id, nom, metier, telephone, status, verification_reason FROM providers ORDER BY id"),
        "clients": rows("SELECT id, nom FROM clients ORDER BY id"),
        "categories": rows("SELECT id, name FROM categories ORDER BY id"),
        "users": rows("SELECT id, phone FROM users ORDER BY id"),
    }

    report = {
        "prestataires": dup_report(tables["prestataires"], "telephone"),
        "providers": dup_report(tables["providers"], "telephone"),
        "users": dup_report(tables["users"], "phone"),
        "categories": dup_report(tables["categories"], "name"),
    }

    ops = []
    if args.apply:
        for row in tables["prestataires"]:
            upd = trim_row(row, ["nom", "metier"])
            if upd:
                ops.append(update_sql("prestataires", row["id"], upd))
        for row in tables["providers"]:
            upd = trim_row(row, ["nom", "metier", "status", "verification_reason"])
            if upd:
                ops.append(update_sql("providers", row["id"], upd))
        for row in tables["clients"]:
            upd = trim_row(row, ["nom"])
            if upd:
                ops.append(update_sql("clients", row["id"], upd))
        for row in tables["categories"]:
            upd = trim_row(row, ["name"])
            if upd:
                ops.append(update_sql("categories", row["id"], upd))
        bridge({"kind": "transaction", "ops": ops})

    summary = {
        "mode": "apply" if args.apply else "dry-run",
        "counts": {k: len(v) for k, v in tables.items()},
        "dups": {k: len(v) for k, v in report.items()},
    }

    if args.json:
        print(json.dumps({"summary": summary, "report": report}, indent=2, ensure_ascii=False))
    else:
        print("Bricol.clic database cleanup")
        print(f"Mode: {summary['mode']}")
        print(
            "Rows: "
            f"prestataires={summary['counts']['prestataires']}, "
            f"providers={summary['counts']['providers']}, "
            f"clients={summary['counts']['clients']}, "
            f"categories={summary['counts']['categories']}, "
            f"users={summary['counts']['users']}"
        )
        print(
            "Duplicates: "
            f"prestataires={summary['dups']['prestataires']}, "
            f"providers={summary['dups']['providers']}, "
            f"users={summary['dups']['users']}, "
            f"categories={summary['dups']['categories']}"
        )
        if not args.apply:
            print("No data changed. Re-run with --apply.")


if __name__ == "__main__":
    main()
