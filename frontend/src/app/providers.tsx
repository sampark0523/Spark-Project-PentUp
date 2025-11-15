"use client";

import * as React from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import EmotionRegistry from "@/lib/emotion-cache";

const theme = createTheme({
	palette: {
		mode: "light",
	},
	shape: { borderRadius: 12 },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
	return (
		<EmotionRegistry>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</EmotionRegistry>
	);
}
