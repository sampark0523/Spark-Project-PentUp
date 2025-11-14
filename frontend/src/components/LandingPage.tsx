"use client";

import * as React from "react";
import { Box, Link } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import styles from "./LandingPage.module.css";

export function LandingPage() {
	return (
		<div className={styles.landingContainer}>
			{/* Orange glow effect */}
			<div className={styles.glowEffect} />

			{/* Navigation */}
			<div className={styles.navigation}>
				<Link href="#notes" className={styles.navLink}>notes</Link>
				<Link href="#about" className={styles.navLink}>about</Link>
				<Link href="#search" className={styles.navLink}>
					<SearchIcon sx={{ fontSize: 18 }} />
				</Link>
			</div>

			{/* Stars */}
			<div className={styles.stars}>
				<div className={styles.star} style={{ top: '15%', left: '10%', transform: 'rotate(45deg) scale(0.6)' }}>★</div>
				<div className={styles.star} style={{ top: '20%', left: '85%', transform: 'rotate(120deg) scale(0.5)' }}>★</div>
				<div className={styles.star} style={{ top: '35%', left: '5%', transform: 'rotate(200deg) scale(0.7)' }}>★</div>
				<div className={styles.star} style={{ top: '40%', left: '90%', transform: 'rotate(300deg) scale(0.6)' }}>★</div>
				<div className={styles.star} style={{ top: '55%', left: '15%', transform: 'rotate(80deg) scale(0.5)' }}>★</div>
				<div className={styles.star} style={{ top: '60%', left: '88%', transform: 'rotate(240deg) scale(0.6)' }}>★</div>
				<div className={styles.star} style={{ top: '75%', left: '8%', transform: 'rotate(160deg) scale(0.7)' }}>★</div>
				<div className={styles.star} style={{ top: '80%', left: '92%', transform: 'rotate(15deg) scale(0.5)' }}>★</div>
			</div>

			{/* Envelopes Container */}
			<div className={styles.envelopesContainer}>
				{/* Bottom envelope */}
				<div className={styles.envelopeBottom}>
					{/* Envelope background */}
					<div className={styles.envelopeBody} />
					{/* Envelope flap */}
					<div className={styles.envelopeFlap} />
				</div>

				{/* Top envelope */}
				<div className={styles.envelopeTop}>
					{/* Envelope background */}
					<div className={styles.envelopeBody}>
						{/* Collection text */}
						<div className={styles.collectionText}>
							A COLLECTION OF UNSENT MESSAGES
						</div>
						
						{/* Postage stamp */}
						<div className={styles.postageStamp}>
							<img 
								src="/Stamp.svg" 
								alt="Stamp" 
								className={styles.stampImage}
							/>
						</div>

						{/* Pent Up Logo */}
						<div className={styles.logoContainer}>
							<img 
								src="/Pent.svg" 
								alt="Pent" 
								className={styles.logoImage}
							/>
							<img 
								src="/Up.svg" 
								alt="Up" 
								className={styles.logoImage}
							/>
						</div>
					</div>
					{/* Envelope flap */}
					<div className={styles.envelopeFlap} />
				</div>
			</div>

			{/* Edit Icon */}
			<div className={styles.editIcon}>
				<EditIcon sx={{ fontSize: 24, color: '#888' }} />
			</div>
		</div>
	);
}
