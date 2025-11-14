"use client";
import styles from "./page.module.css";
import { Box, Container, Stack, Typography } from "@mui/material";
import { LandingPage } from "@/components/LandingPage";
import { MessageForm } from "@/components/MessageForm";
import { MessageGrid } from "@/components/MessageGrid";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <Box>
      <LandingPage />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f5e6d3",
          backgroundImage: 
            `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.12'/%3E%3C/svg%3E")`,
          pt: 8,
          position: "relative",
        }}
      >
        <Container maxWidth="lg" sx={{ py: 6, px: { xs: 3, sm: 4, md: 6 } }}>
          <Stack spacing={4}>
            <MessageForm />
            <MessageGrid />
          </Stack>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
