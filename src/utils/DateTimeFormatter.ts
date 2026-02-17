export function DateTimeFormatter(dateString: string): string {
  const date = new Date(dateString);

  if (dateString == '') return '';

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Paris',
    hour12: false,
  };

  const formatted = new Intl.DateTimeFormat('fr-FR', options).format(date);

  const capitalized = formatted.replace(
    /^(\d{2}) (\w+)/,
    (_, day, month) => `${day} ${month.charAt(0).toUpperCase()}${month.slice(1)}`
  );

  return capitalized.replace(',', ' à').replace(/(\d+)h(\d+)/, (_, h, m) => `${h}h${m}`);
}
