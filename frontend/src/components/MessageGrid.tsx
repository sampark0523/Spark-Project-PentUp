"use client";

import * as React from "react";
import useSWR from "swr";
import { Box, Card, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import type { MessageRow } from "@/lib/supabase";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

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
				gap: 2.5,
			}}
		>
			{messages.map((m) => (
				<Card
					key={m.id}
					sx={{
						bgcolor: "#fff",
						borderRadius: 2,
						boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
						display: "flex",
						flexDirection: "column",
						overflow: "hidden",
						transition: "transform 0.2s, box-shadow 0.2s",
						"&:hover": {
							transform: "translateY(-2px)",
							boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
						},
					}}
				>
					{/* Colored header bar */}
					<Box
						sx={{
							backgroundColor: m.color || "#f0f0f0",
							p: 1.5,
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<Typography
							sx={{
								fontSize: "0.875rem",
								fontWeight: 500,
								color: "#111",
								fontFamily: "Arial, Helvetica, sans-serif",
							}}
						>
							To: {m.recipients}
						</Typography>
						<Box
							sx={{
								width: 20,
								height: 20,
								border: "1.5px solid #111",
								borderRadius: 1,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								flexShrink: 0,
							}}
						>
							<PersonIcon sx={{ fontSize: 12, color: "#111" }} />
						</Box>
					</Box>
					
					{/* White body */}
					<Box
						sx={{
							p: 2.5,
							flex: 1,
							backgroundColor: "#fff",
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
			))}
			{messages.length === 0 && (
				<Box
					sx={{
						width: "100%",
						textAlign: "center",
						color: "#666",
						py: 6,
						gridColumn: "1 / -1",
						fontFamily: "Arial, Helvetica, sans-serif",
					}}
				>
					No messages yet. Be the first!
				</Box>
			)}
		</Box>
	);
}
