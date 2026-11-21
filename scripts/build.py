#!/usr/bin/env python3
"""Reproducibly assemble the dependency-free static release."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
SOURCES = [ROOT / "src", ROOT / "public"]

if DIST.exists():
    shutil.rmtree(DIST)
DIST.mkdir()
for source in SOURCES:
    for path in source.rglob("*"):
        if path.is_file():
            target = DIST / path.relative_to(source)
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(path, target)
print(f"Built {DIST.relative_to(ROOT)}")
