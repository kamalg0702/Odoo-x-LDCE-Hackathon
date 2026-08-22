FILES=(
  "frontend/vite.config.js"
  "backend/app/__init__.py"
  "backend/app/core/database.py"
  "backend/app/core/middleware.py"
  "backend/app/modules/stops/models.py"
  "backend/app/modules/activities/models.py"
  "backend/app/modules/activities/service.py"
  "backend/app/modules/budget/models.py"
  "backend/app/modules/share/models.py"
  "backend/app/modules/admin/routes.py"
  "backend/app/modules/admin/service.py"
  "backend/test_api.py"
  "frontend/src/core/hooks/useAuth.js"
  "frontend/src/features/dashboard/DashboardPage.jsx"
  "frontend/src/features/trips/CreateTripPage.jsx"
)
OUTPUT="claude_dump2.txt"
printf "" > "$OUTPUT"
for FILE in "${FILES[@]}"; do
  printf "==== FILE: %s ====\n" "$FILE" >> "$OUTPUT"
  if [ -f "$FILE" ]; then
    cat "$FILE" >> "$OUTPUT"
    printf "\n==== END: %s ====\n\n" "$FILE" >> "$OUTPUT"
    echo "✓ $FILE"
  else
    printf "[NOT FOUND]\n==== END: %s ====\n\n" "$FILE" >> "$OUTPUT"
    echo "✗ $FILE"
  fi
done
echo "Done → $OUTPUT"
