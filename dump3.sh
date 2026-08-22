FILES=(
  "frontend/src/index.css"
  "frontend/src/App.css"
  "frontend/src/main.jsx"
  "frontend/src/App.jsx"
  "frontend/src/components/ui/Card/Card.jsx"
  "frontend/src/components/ui/Button/Button.jsx"
  "frontend/src/components/ui/Input/Input.jsx"
  "frontend/src/components/layout/Navbar/Navbar.jsx"
  "frontend/src/components/layout/Sidebar/Sidebar.jsx"
  "frontend/src/components/layout/PageWrapper/PageWrapper.jsx"
  "frontend/src/core/utils/currency.js"
  "frontend/src/features/home/HomePage.jsx"
)
OUTPUT="claude_dump3.txt"
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

# Also find theme-related files automatically
echo "" >> "$OUTPUT"
echo "==== THEME FILES FOUND ====" >> "$OUTPUT"
find frontend/src -name "*theme*" -o -name "*Theme*" -o -name "*dark*" -o -name "*Dark*" -o -name "*cyber*" 2>/dev/null >> "$OUTPUT"
echo "==== END THEME FILES ====" >> "$OUTPUT"

echo "Done → $OUTPUT"
