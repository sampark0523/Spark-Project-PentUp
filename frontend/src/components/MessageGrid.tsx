"use client";

import * as React from "react";
import useSWR from "swr";
import { Box, Card, CardContent, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import type { MessageRow } from "@/lib/supabase";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function MessageGrid() {
	const { data } = useSWR<MessageRow[]>(`/api/messages`, fetcher, {
		refreshInterval: 0,
		revalidateOnFocus: true,
	});

	const messages = data ?? [];

	return (
		<Grid container spacing={2} sx={{ mt: 2 }}>
			{messages.map((m) => (
				<Grid key={m.id} item xs={12} sm={6} md={4}>
					<Card sx={{ bgcolor: m.color, color: "#111", minHeight: 140 }}>
						<CardContent>
							<Typography variant="subtitle2">To: {m.recipients}</Typography>
							<Typography variant="body1" sx={{ mt: 1 }}>
								{m.body}
							</Typography>
							<Typography variant="caption" sx={{ opacity: 0.8 }}>
								{new Date(m.created_at).toLocaleString()}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
			))}
			{messages.length === 0 && (
				<Box sx={{ width: "100%", textAlign: "center", color: "text.secondary", py: 6 }}>
					No messages yet. Be the first!
				</Box>
			)}
		</Grid>
	);
}
