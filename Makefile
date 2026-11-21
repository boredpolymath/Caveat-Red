PYTHON ?= python3

.PHONY: dev build test lint format typecheck check
dev:
	$(PYTHON) -m http.server 8000 --directory dist
build:
	$(PYTHON) scripts/build.py
test lint typecheck check:
	$(PYTHON) scripts/check.py
format:
	$(PYTHON) -B -c "compile(open('scripts/build.py').read(), 'scripts/build.py', 'exec'); compile(open('scripts/check.py').read(), 'scripts/check.py', 'exec')"
