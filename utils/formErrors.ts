/**
 * Flattens a Laravel-style `errors: { field: string[] }` validation payload
 * (as returned by ValidationException, see backend bootstrap/app.php) into
 * a `{ field: string }` map — one message per field, ready to hand to an
 * AppTextInput's `error` prop.
 */
export function extractFieldErrors(error: any): Record<string, string> {
  const errors = error?.response?.data?.errors;
  if (!errors || typeof errors !== 'object') return {};

  return Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => [
      field,
      Array.isArray(messages) ? String(messages[0]) : String(messages),
    ])
  );
}

/** True when the error response carries at least one field-level message. */
export function hasFieldErrors(error: any): boolean {
  return Object.keys(extractFieldErrors(error)).length > 0;
}
