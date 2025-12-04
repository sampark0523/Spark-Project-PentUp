"use client";

import * as React from "react";
import useSWR from "swr";
import { Box, Card, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import type { MessageRow } from "@/lib/supabase";
import { Stamp } from "./stamps/Stamp";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// Generate a random width for each card between min and max
function getRandomWidth(min = 383, max = 615) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

// Darken a hex color by a percentage
function darkenColor(hex: string, percent: number): string {
	// Remove # if present
	const color = hex.replace("#", "");

	// Parse RGB
	const r = parseInt(color.substring(0, 2), 16);
	const g = parseInt(color.substring(2, 4), 16);
	const b = parseInt(color.substring(4, 6), 16);

	// Darken
	const newR = Math.max(0, Math.floor(r * (1 - percent)));
	const newG = Math.max(0, Math.floor(g * (1 - percent)));
	const newB = Math.max(0, Math.floor(b * (1 - percent)));

	// Convert back to hex
	return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
}

// Calculate widths for a row of 3 cards
function calculateRowWidths(totalWidth: number, gap: number): [number, number, number] {
	const width1 = getRandomWidth();
	const width2 = getRandomWidth();
	const width3 = totalWidth - width1 - width2 - (gap * 2);
	return [width1, width2, width3];
}

export function MessageGrid() {
	const { data } = useSWR<MessageRow[]>(`/api/messages`, fetcher, {
		refreshInterval: 0,
		revalidateOnFocus: true,
	});

	const messages = Array.isArray(data) ? data : [];

	// Group messages into rows of 3 with pre-calculated widths
	const rows = React.useMemo(() => {
		const rowData: Array<Array<{ message: MessageRow; width: number }>> = [];
		const totalWidth = 1400; // Total width for all 3 cards + gaps
		const gap = 24; // Gap between cards (3 * 8px)

		for (let i = 0; i < messages.length; i += 3) {
			const [w1, w2, w3] = calculateRowWidths(totalWidth, gap);
			const row = [];

			if (messages[i]) row.push({ message: messages[i], width: w1 });
			if (messages[i + 1]) row.push({ message: messages[i + 1], width: w2 });
			if (messages[i + 2]) row.push({ message: messages[i + 2], width: w3 });

			rowData.push(row);
		}

		return rowData;
	}, [messages]);

	return (
		<Box sx={{ mt: 4 }}>
			{rows.map((row, rowIndex) => (
				<Box
					key={rowIndex}
					sx={{
						display: "flex",
						gap: 3,
						mb: 3,
					}}
				>
					{row.map(({ message: m, width }) => {
						const cardColor = m.color || "#f0f0f0";
						const headerColor = darkenColor(cardColor, 0.15);

						return (
							<Card
								key={m.id}
								sx={{
									width: `${width}px`,
									height: "200px",
									bgcolor: "#fff",
									borderRadius: "10px",
									border: `6px solid ${cardColor}`,
									boxShadow: "0 3px 10px rgba(0, 0, 0, 0.15)",
									display: "flex",
									flexDirection: "column",
									overflow: "hidden",
									transition: "transform 0.2s, box-shadow 0.2s",
									"&:hover": {
										transform: "translateY(-2px)",
										boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
									},
								}}
							>
								{/* Colored header bar */}
								<Box
									sx={{
										backgroundColor: headerColor,
										p: 1.5,
										pr: 8,
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										position: "relative",
						borderRadius: "4px 4px 0 0",
									}}
								>
									<Typography
										sx={{
											color: "#FFF",
											fontFamily: "'Lower Pixel', monospace",
											fontSize: "24px",
											fontStyle: "normal",
											fontWeight: 400,
											lineHeight: "normal",
										}}
									>
										To: {m.recipients || "Anonymous"}
									</Typography>

									{/* Stamp in top-right corner */}
									<Box
										sx={{
											position: "absolute",
											top: 0,
											right: 8,
										}}
									>
										<Stamp color={headerColor} />
									</Box>
								</Box>

								{/* White body */}
								<Box
									sx={{
										p: 2.5,
										flex: 1,
										backgroundColor: "#fff",
										overflow: "auto",
									}}
								>
									<Typography
										sx={{
											fontSize: "0.875rem",
											lineHeight: 1.7,
											color: "#111",
											fontFamily: "Arial, Helvetica, sans-serif",
										}}
									>
										{m.body}
									</Typography>
								</Box>
							</Card>
						);
					})}
				</Box>
			))}
			{messages.length === 0 && (
				<Box
					sx={{
						width: "100%",
						textAlign: "center",
						color: "#666",
						py: 6,
						fontFamily: "Arial, Helvetica, sans-serif",
					}}
				>
					No messages yet. Be the first!
				</Box>
			)}
		</Box>
	);
}
