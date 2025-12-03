"use client";

import * as React from "react";
import { Box, Container, Typography, Snackbar, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getBrowserClient } from "@/lib/supabase";
import { HomeButton } from "@/components/HomeButton";
import { isUPennEmail } from "@/lib/auth";
import { AuthModal } from "@/components/AuthModal";

export default function SendMessagePage() {
	const router = useRouter();
	const [recipient, setRecipient] = React.useState("");
	const [message, setMessage] = React.useState("");
	const [selectedCat, setSelectedCat] = React.useState(0);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const [showAuthModal, setShowAuthModal] = React.useState(false);
	const [flaggedMessage, setFlaggedMessage] = React.useState<string | null>(null);
	const [showFlaggedPopup, setShowFlaggedPopup] = React.useState(false);

	const catIcons = [
		{ image: "/assets/cat-icons/image 4.svg", color: "#81C700" }, // bright green
		{ image: "/assets/cat-icons/image 5.svg", color: "#F788DB" }, // bright pink
		{ image: "/assets/cat-icons/image 7.svg", color: "#0E3663" }, // dark navy blue
		{ image: "/assets/cat-icons/image 8.svg", color: "#FFD748" }, // bright yellow
		{ image: "/assets/cat-icons/image 13.svg", color: "#FFB854" }, // bright orange
		{ image: "/assets/cat-icons/image 14.svg", color: "#BB95F7" }, // bright purple
		{ image: "/assets/cat-icons/image 15.svg", color: "#6595F7" }, // bright light blue
		{ image: "/assets/cat-icons/image 16.svg", color: "#FF8654" }, // bright orange-red/coral
	];

	// Clear session on page load (require re-verification each time)
	React.useEffect(() => {
		const clearSession = async () => {
			const supabase = getBrowserClient();
			await supabase.auth.signOut();
			console.log("Session cleared on page load");
		};
		clearSession();
	}, []);

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

	const handleSubmit = async () => {
		// Validate fields FIRST
		if (!recipient || !message) {
			setError("Please fill in both recipient and message fields.");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			// Check if user is authenticated
			const supabase = getBrowserClient();
			const { data: { session } } = await supabase.auth.getSession();

			console.log("Current session:", session);

			if (!session) {
				// Save pending message to localStorage before showing auth modal
				const pendingMessage = {
					recipient,
					message,
					color: catIcons[selectedCat].color,
				};
				localStorage.setItem('pendingMessage', JSON.stringify(pendingMessage));
				console.log("Saved pending message:", pendingMessage);

				// Show auth modal to prompt user to sign in with Penn email
				console.log("No session found, showing auth modal");
				setLoading(false);
				setShowAuthModal(true);
				return;
			}

			console.log("User email:", session.user?.email);
			console.log("Email verified:", session.user?.email_confirmed_at);

			// Verify UPenn email
			const userEmail = session.user?.email;
			if (!userEmail || !isUPennEmail(userEmail)) {
				setError("Only UPenn students can post messages. Please sign in with your UPenn email.");
				setLoading(false);
				return;
			}

			// Check if email is verified
			const emailVerified = session.user?.email_confirmed_at;
			if (!emailVerified) {
				setError("Please verify your email address before posting. Check your inbox for the verification link.");
				setLoading(false);
				return;
			}

			const res = await fetch(`/api/messages`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${session.access_token}`,
				},
				body: JSON.stringify({
					recipients: recipient,
					body: message,
					color: catIcons[selectedCat].color,
				}),
			});

			if (!res.ok) {
				const j = await res.json().catch(() => ({}));
				throw new Error(j.error || `Request failed: ${res.status}`);
			}

			const responseData = await res.json();
			
			// Check if message was flagged
			if (responseData.message && responseData.message.includes("flagged")) {
				// Store flagged message in localStorage so it persists after redirect
				localStorage.setItem('flaggedMessage', responseData.message);
				setFlaggedMessage(responseData.message);
				setShowFlaggedPopup(true);
				// Clear form but don't redirect
				setRecipient("");
				setMessage("");
				setSelectedCat(0);
			} else {
				// Success - clear form and redirect
				setRecipient("");
				setMessage("");
				setSelectedCat(0);
				router.push("/");
			}
		} catch (err: any) {
			setError(err.message ?? "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box
			sx={{
				minHeight: "100vh",
				height: "100vh",
				background: `url(/assets/add-message-bg.png) center / cover no-repeat`,
				position: "relative",
				overflow: "hidden",
			}}
		>
			{/* Background Ellipses */}
			{/* Top Right Ellipse */}
			<Box
				sx={{
					position: "absolute",
					right: "-350px",
					top: "-350px",
					width: "956px",
					height: "977px",
					zIndex: 0,
					pointerEvents: "none",
					overflow: "visible",
				}}
			>
				<Image
					src="/assets/ellipse-orange.svg"
					alt=""
					width={956}
					height={977}
					style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
				/>
			</Box>
			{/* Bottom Left Ellipse */}
			<Box
				sx={{
					position: "absolute",
					left: "-300px",
					bottom: "-300px",
					width: "957px",
					height: "919px",
					zIndex: 0,
					pointerEvents: "none",
					overflow: "visible",
				}}
			>
				<Image
					src="/assets/ellipse-4.svg"
					alt=""
					width={957}
					height={919}
					style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
				/>
			</Box>

			{/* Home Button */}
			<HomeButton />

			<Container
				maxWidth="lg"
				sx={{
					pt: 6,
					pb: 20,
					position: "relative",
					zIndex: 1,
					height: "100%",
					overflowY: "auto",
					overflowX: "hidden",
				}}
			>
				{/* Title */}
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: 2,
						mb: 2,
					}}
				>
					<Image
						src="/assets/send-message-icon.svg"
						alt="Pen icon"
						width={50}
						height={50}
					/>
					<Image
						src="/assets/send-message-title.svg"
						alt="Send a Message"
						width={400}
						height={60}
					/>
				</Box>

				{/* Main Content Area */}
				<Box
					sx={{
						display: "flex",
						gap: 4,
						justifyContent: "center",
						alignItems: "flex-start",
					}}
				>
					{/* Message Input Section - Dynamic Color Border */}
					<Box
						sx={{
							width: 500,
							bgcolor: catIcons[selectedCat].color,
							borderRadius: 3,
							p: 3,
							boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.25)",
							position: "relative",
							transition: "background-color 0.3s ease",
						}}
					>
						{/* Stamp Icon - Top Right of entire container */}
						<Box
							sx={{
								width: "76px",
								height: "61px",
								position: "absolute",
								top: 16,
								right: 16,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								zIndex: 3,
							}}
						>
							<Image
								src="/assets/message-box/stamp-icon.svg"
								alt="Stamp"
								width={76}
								height={61}
								style={{ objectFit: "contain" }}
							/>
						</Box>

						{/* To Field */}
						<Box
							sx={{
								bgcolor: catIcons[selectedCat].color,
								borderRadius: "10px",
								p: 2,
								mb: 2,
								display: "flex",
								alignItems: "center",
								gap: 2,
								position: "relative",
								transition: "background-color 0.3s ease",
							}}
						>
							<Typography
								sx={{
									color: "#FFF",
									fontWeight: 400,
									fontFamily: "'Lower Pixel', monospace",
									fontSize: "35px",
									fontStyle: "normal",
									lineHeight: "normal",
								}}
							>
								To:
							</Typography>
							<input
								type="text"
								placeholder="Enter Initials"
								value={recipient}
								onChange={(e) => {
									// Only allow letters and limit to 3 characters
									const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
									setRecipient(value);
								}}
								maxLength={3}
								className="recipient-input"
								style={{
									flex: 1,
									background: "transparent",
									border: "none",
									color: "#FFF",
									outline: "none",
									fontFamily: "'Lower Pixel', monospace",
									fontSize: "35px",
									fontStyle: "normal",
									fontWeight: 400,
									lineHeight: "normal",
								}}
							/>
							<style jsx>{`
								.recipient-input::placeholder {
									color: rgba(255, 255, 255, 0.6);
									font-family: 'Lower Pixel', monospace;
									font-size: 35px;
								}
							`}</style>
						</Box>

						{/* Message Textarea */}
						<Box
							sx={{
								bgcolor: "#fff",
								borderRadius: "10px",
								p: 3,
								height: 389,
								position: "relative",
							}}
						>
							<textarea
								placeholder="Type your message here..."
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								className="message-textarea"
								style={{
									width: "100%",
									height: "100%",
									border: "none",
									outline: "none",
									resize: "none",
									fontSize: "30px",
									fontFamily: "Helvetica",
									lineHeight: "normal",
									color: "#000",
									fontStyle: "normal",
									fontWeight: 400,
									background: "transparent",
									position: "relative",
									zIndex: 2,
								}}
							/>
							<style jsx>{`
								.message-textarea::placeholder {
									white-space: nowrap;
									overflow: hidden;
									text-overflow: ellipsis;
								}
							`}</style>
						</Box>
					</Box>

					{/* Customization Section */}
					<Box
						sx={{
							width: 280,
							bgcolor: "rgba(180, 180, 180, 0.7)",
							borderRadius: 3,
							p: 3,
							boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.25)",
						}}
					>
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								mb: 3,
							}}
						>
							<Image
								src="/assets/customization-title.svg"
								alt="Customization"
								width={200}
								height={40}
							/>
						</Box>

						{/* Cat Icons Grid */}
						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: "repeat(2, 1fr)",
								gap: 2,
							}}
						>
							{catIcons.map((cat, index) => (
								<Box
									key={index}
									onClick={() => setSelectedCat(index)}
									sx={{
										width: "100%",
										height: 90,
										position: "relative",
										borderRadius: 2,
										border:
											selectedCat === index
												? "5px solid #000"
												: "5px solid #555",
										cursor: "pointer",
										transition: "all 0.2s",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										overflow: "hidden",
										backgroundColor: cat.color,
										"&::before": {
											content: '""',
											position: "absolute",
											top: 0,
											left: 0,
											right: 0,
											bottom: 0,
											backgroundImage: "url(/assets/cat-icon-bg.svg)",
											backgroundSize: "cover",
											backgroundPosition: "center",
											opacity: 0.3,
											zIndex: 1,
										},
										"&:hover": {
											transform: "scale(1.05)",
											border: "5px solid #000",
										},
									}}
								>
									<Image
										src={cat.image}
										alt={`Cat ${index + 1}`}
										width={70}
										height={70}
										style={{ objectFit: "contain", position: "relative", zIndex: 2 }}
									/>
								</Box>
							))}
						</Box>
					</Box>
				</Box>

				{/* Submit Button */}
				<Box sx={{
					position: "absolute",
					bottom: -50,
					left: "50%",
					transform: "translateX(-50%)",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 2,
					zIndex: 10
				}}>
					<Box
						onClick={!loading && recipient && message ? handleSubmit : undefined}
						sx={{
							position: "relative",
							px: 6,
							py: 2.5,
							bgcolor: "#737373",
							borderRadius: "8px",
							cursor: (!loading && recipient && message) ? "pointer" : "not-allowed",
							opacity: (!loading && recipient && message) ? 1 : 0.5,
							transition: "opacity 0.2s, transform 0.2s",
							boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.25)",
							backgroundImage:
								`url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulance type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.3'/%3E%3C/svg%3E")`,
							"&:hover": (!loading && recipient && message) ? {
								transform: "scale(1.02)",
								bgcolor: "#4a4a4a",
							} : {},
						}}
					>
						<Typography
							sx={{
								color: "#fff",
								fontSize: "1.5rem",
								fontWeight: 400,
								textAlign: "center",
								whiteSpace: "nowrap",
								userSelect: "none",
							}}
						>
							{loading ? "Submitting..." : "Submit Your Message"}
						</Typography>
					</Box>
					{error && (
						<Typography sx={{ color: "#D32F2F", fontSize: "0.9rem", fontWeight: 500 }}>
							{error}
						</Typography>
					)}
				</Box>
			</Container>

			{/* Auth Modal */}
			<AuthModal
				open={showAuthModal}
				onClose={() => setShowAuthModal(false)}
				onSuccess={() => {
					setShowAuthModal(false);
					// After successful auth, user needs to verify email before they can retry
				}}
			/>

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
					{flaggedMessage || "Your message has been flagged due to inappropraite content and is waiting for approval from a moderator. It will be displayed if approved."}
				</Alert>
			</Snackbar>
		</Box>
	);
}
