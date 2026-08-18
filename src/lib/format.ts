const shortDateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const longDateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const monthYearFormatter = new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' });

// e.g. "2 Aug 2026" -- the default used across most post/article dates.
export function formatDate(date: Date | string): string {
	return shortDateFormatter.format(new Date(date));
}

// e.g. "2 August 2026" -- used where the date is a standalone, prominent value.
export function formatDateLong(date: Date | string): string {
	return longDateFormatter.format(new Date(date));
}

// e.g. "Aug 2026" -- used for repo "last pushed" dates, where the day isn't meaningful.
export function formatMonthYear(date: Date | string): string {
	return monthYearFormatter.format(new Date(date));
}
