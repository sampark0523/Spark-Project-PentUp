"use client";
import * as React from "react";
import styles from "./page.module.css";
import { Box, Container, Stack, Typography, Snackbar, Alert } from "@mui/material";
import { LandingPage } from "@/components/LandingPage";
import { MessageForm } from "@/components/MessageForm";
import { MessageGrid } from "@/components/MessageGrid";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [showForm, setShowForm] = React.useState(false);
  const [flaggedMessage, setFlaggedMessage] = React.useState<string | null>(null);
  const [showFlaggedPopup, setShowFlaggedPopup] = React.useState(false);

  // Check for flagged message in localStorage on page load
  React.useEffect(() => {
    const flaggedMsg = localStorage.getItem('flaggedMessage');
    if (flaggedMsg) {
      setFlaggedMessage(flaggedMsg);
      setShowFlaggedPopup(true);
      // Clear it from localStorage after showing
      localStorage.removeItem('flaggedMessage');
    }
  }, []);

  // Clear flagged popup when a new message is submitted
  const handleMessageSubmitted = React.useCallback(() => {
    setShowFlaggedPopup(false);
    setFlaggedMessage(null);
    localStorage.removeItem('flaggedMessage');
    setShowForm(false);
  }, []);

  const contentBoxSx = {
    minHeight: "100vh",
    bgcolor: "#f5e6d3",
    backgroundImage: 
      `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.12'/%3E%3C/svg%3E")`,
    pt: 0.5,
    position: "relative",
  };

  return (
    <Box>
      <LandingPage onAddClick={() => setShowForm(!showForm)} />
      <Box sx={contentBoxSx} data-message-content>
        <Container maxWidth="lg" sx={{ py: 6, px: { xs: 3, sm: 4, md: 6 } }}>
          <Stack spacing={4}>
            {showForm && <MessageForm onSubmitted={handleMessageSubmitted} />}
            <MessageGrid />
          </Stack>
        </Container>
      </Box>
      <Footer />

      {/* Flagged Message Popup */}
      <Snackbar
        open={showFlaggedPopup}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={6000}
        onClose={() => setShowFlaggedPopup(false)}
      >
        <Alert 
          onClose={() => setShowFlaggedPopup(false)} 
          severity="warning" 
          sx={{ width: "100%" }}
        >
          {flaggedMessage || "Your message has been flagged for content review and is waiting for approval from a moderator. It will be displayed if approved."}
        </Alert>
      </Snackbar>
    </Box>
  );
}
