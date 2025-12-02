"use client";

import * as React from "react";
import styles from "./LandingPage.module.css";

export function LandingPage({ onAddClick }: { onAddClick?: () => void }) {
	return (
		<div className={styles.landingContainer}>
			{/* Orange glow effect */}
			<div className={styles.glowEffect} />

			{/* Envelopes Container */}
			<div className={styles.envelopesContainer}>
				<img 
					src="/assets/envelopes.png" 
					alt="Envelopes" 
					className={styles.envelopesImage}
				/>
			</div>

			{/* Add Button */}
			<button 
				className={styles.addButton}
				onClick={onAddClick}
				aria-label="Add message"
			>
				<img 
					src="/assets/add.png" 
					alt="Add" 
					className={styles.addButtonImage}
				/>
			</button>
		</div>
	);
}
