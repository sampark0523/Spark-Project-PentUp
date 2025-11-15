/**
 * Validates if an email is from UPenn
 * Accepts emails like: sampark@sas.upenn.edu, sampark@seas.upenn.edu, etc.
 */
export function isUPennEmail(email: string): boolean {
	if (!email) return false;

	const normalizedEmail = email.toLowerCase().trim();

	// Must end with @upenn.edu or @*.upenn.edu (for different schools)
	const upennPattern = /@([a-z]+\.)?upenn\.edu$/;

	return upennPattern.test(normalizedEmail);
}

/**
 * Gets the Penn school from email (sas, seas, wharton, etc.)
 * Returns null if not a Penn email
 */
export function getPennSchool(email: string): string | null {
	if (!isUPennEmail(email)) return null;

	const match = email.toLowerCase().match(/@([a-z]+)\.upenn\.edu$/);
	return match ? match[1] : 'upenn';
}
