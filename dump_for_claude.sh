#!/usr/bin/env bash
# dump_for_claude.sh
# Run from repo root in Git Bash

FILES=(
  "backend/run.py"
  "backend/requirements.txt"
  "backend/seeds.py"
  "backend/app/__init__.py"
  "backend/app/core/config.py"
  "backend/app/core/database.py"
  "backend/app/core/extensions.py"
  "backend/app/core/middleware.py"
  "backend/app/modules/auth/routes.py"
  "backend/app/modules/auth/models.py"
  "backend/app/modules/auth/service.py"
  "backend/app/modules/trips/routes.py"
  "backend/app/modules/trips/models.py"
  "backend/app/modules/trips/service.py"
  "backend/app/modules/stops/routes.py"
  "backend/app/modules/stops/service.py"
  "backend/app/modules/budget/service.py"
  "backend/app/modules/share/service.py"
  "frontend/package.json"
  "frontend/src/core/api/client.js"
  "frontend/src/core/store/auth.store.js"
  "frontend/src/core/store/trips.store.js"
  "frontend/src/router/index.jsx"
  "frontend/src/features/auth/LoginPage.jsx"
  "frontend/src/features/itinerary/ItineraryBuilder.jsx"
  "frontend/src/features/budget/BudgetPage.jsx"
  "frontend/src/features/share/PublicItineraryPage.jsx"
)

OUTPUT="claude_dump.txt"
SUCCESS=0
FAIL=0

printf "" > "$OUTPUT"

for FILE in "${FILES[@]}"; do
  printf "==== FILE: %s ====\n" "$FILE" >> "$OUTPUT"
  if [ -f "$FILE" ]; then
    cat "$FILE" >> "$OUTPUT"
    printf "\n==== END: %s ====\n\n" "$FILE" >> "$OUTPUT"
    echo "✓ $FILE"
    ((SUCCESS++))
  else
    printf "[NOT FOUND]\n==== END: %s ====\n\n" "$FILE" >> "$OUTPUT"
    echo "✗ $FILE"
    ((FAIL++))
  fi
done

echo ""
echo "Done: $SUCCESS found, $FAIL missing → claude_dump.txt"