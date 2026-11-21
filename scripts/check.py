#!/usr/bin/env python3
"""Dependency-free release checks for source safety and build integrity."""
from pathlib import Path
import json
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
errors = []
for path in (ROOT / "src").rglob("*.js"):
    source = path.read_text()
    for forbidden in (".innerHTML", "eval(", "document.write("):
        if forbidden in source:
            errors.append(f"{path.relative_to(ROOT)} contains forbidden {forbidden}")
for path in [ROOT / "src/index.html", ROOT / "public/manifest.webmanifest", ROOT / "public/sw.js"]:
    if not path.exists(): errors.append(f"Missing required file: {path.relative_to(ROOT)}")
try:
    manifest = json.loads((ROOT / "public/manifest.webmanifest").read_text())
    if manifest.get("scope") != "./": errors.append("Manifest scope must be ./")
except json.JSONDecodeError as error:
    errors.append(f"Invalid manifest JSON: {error}")
subprocess.run([sys.executable, str(ROOT / "scripts/build.py")], check=True)
for required in ["index.html", "app/app.js", "app/domain.js", "app/storage.js", "app/styles.css", "sw.js", "manifest.webmanifest"]:
    if not (ROOT / "dist" / required).exists(): errors.append(f"Build omitted {required}")
if errors:
    print("\n".join(errors), file=sys.stderr); sys.exit(1)
print("Static safety and release-structure checks passed.")
