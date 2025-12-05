// Mascot configuration - maps colors to their corresponding cat icons
export const catIcons = [
	{ image: "/assets/cat-icons/image 8.svg", color: "#81C700" }, // bright green
	{ image: "/assets/cat-icons/image 5.svg", color: "#F788DB" }, // bright pink
	{ image: "/assets/cat-icons/image 16.svg", color: "#0E3663" }, // dark navy blue
	{ image: "/assets/cat-icons/image 15.svg", color: "#FFD748" }, // bright yellow
	{ image: "/assets/cat-icons/image 14.svg", color: "#FFB854" }, // bright orange
	{ image: "/assets/cat-icons/image 13.svg", color: "#BB95F7" }, // bright purple
	{ image: "/assets/cat-icons/image 7.svg", color: "#6595F7" }, // bright light blue
	{ image: "/assets/cat-icons/image 4.svg", color: "#FF8654" }, // bright orange-red/coral
];

// Create a map for quick color-to-mascot lookup
const colorToMascotMap = new Map<string, string>(
	catIcons.map((cat) => [cat.color.toLowerCase(), cat.image])
);

/**
 * Get the mascot image path for a given color.
 * Returns the matching mascot or null if no match is found.
 */
export function getMascotForColor(color: string | null | undefined): string | null {
	if (!color) return null;
	return colorToMascotMap.get(color.toLowerCase()) ?? null;
}

