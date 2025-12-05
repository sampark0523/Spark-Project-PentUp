"use client";

import * as React from "react";
import useSWR from "swr";
import { Box, Card, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import type { MessageRow } from "@/lib/supabase";
import { Stamp } from "./stamps/Stamp";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

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

export function MessageGrid() {
	const { data } = useSWR<MessageRow[]>(`/api/messages`, fetcher, {
		refreshInterval: 0,
		revalidateOnFocus: true,
	});

	const messages = Array.isArray(data) ? data : [];

	return (
		<Box
			sx={{
				mt: 4,
				display: "grid",
				gridTemplateColumns: {
					xs: "1fr",
					sm: "repeat(2, 1fr)",
					md: "repeat(3, 1fr)",
				},
				gap: { xs: 2, sm: 2.5, md: 3 },
				width: "100%",
			}}
		>
			{messages.map((m) => {
				const cardColor = m.color || "#f0f0f0";
				const headerColor = darkenColor(cardColor, 0.15);

				return (
					<Card
						key={m.id}
						sx={{
							width: "100%",
							minHeight: { xs: "160px", sm: "180px", md: "200px" },
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
								p: { xs: 1, sm: 1.25, md: 1.5 },
								pr: { xs: 6, sm: 7, md: 8 },
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
									fontSize: { xs: "18px", sm: "21px", md: "24px" },
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
								p: { xs: 1.5, sm: 2, md: 2.5 },
								flex: 1,
								backgroundColor: "#fff",
								overflow: "auto",
							}}
						>
							<Typography
								sx={{
									fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.875rem" },
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
			{messages.length === 0 && (
				<Box
					sx={{
						gridColumn: "1 / -1",
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
