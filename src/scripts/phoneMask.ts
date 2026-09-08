/**
 * Types "(516) 555-0100" for the visitor as they enter digits, so the strict
 * pattern on the field is something the form HELPS them satisfy rather than
 * something it punishes them for missing.
 *
 * Ported from the sibling Dormer Harpring site, where it is shared by the
 * consultation and co-counsel forms. Attach with `data-phone-mask` on the input.
 *
 * ⚠️ THE CARET WALK IS THE WHOLE DIFFICULTY. Rewriting `input.value` moves the
 * caret to the end, so editing the middle of a number — fixing one wrong digit —
 * would throw the cursor to the end after every keystroke. Counting the digits
 * BEFORE the caret, reformatting, then walking the new value until the same
 * number of digits has passed is what puts it back where the visitor was.
 */

const format = (digits: string) => {
  if (digits.length <= 3) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

for (const input of document.querySelectorAll<HTMLInputElement>("[data-phone-mask]")) {
  input.addEventListener("input", () => {
    const caret = input.selectionStart ?? input.value.length;
    const digitsBeforeCaret = (input.value.slice(0, caret).match(/\d/g) ?? []).length;

    let digits = input.value.replace(/\D/g, "");
    // A pasted "+1 516 358 6900" or "15163586900" carries the country code; drop
    // it rather than shifting every digit one place left.
    if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
    digits = digits.slice(0, 10);

    input.value = format(digits);

    // Walk the new value until the same number of digits has passed.
    let seen = 0;
    let position = input.value.length;
    for (let i = 0; i < input.value.length; i++) {
      if (/\d/.test(input.value[i]!)) seen++;
      if (seen === digitsBeforeCaret) {
        position = i + 1;
        break;
      }
    }
    if (digitsBeforeCaret === 0) position = input.value.length;
    input.setSelectionRange(position, position);
  });
}
