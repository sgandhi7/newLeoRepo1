export function convertToReadableFormat(
  dateString: string | number | Date | undefined,
) {
  if (dateString === undefined) {
    return '';
  }
  const date = new Date(dateString);
  return date.toLocaleString();
}
