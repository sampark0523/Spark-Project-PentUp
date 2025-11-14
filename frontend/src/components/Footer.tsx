"use client";

import * as React from "react";
import { Box, Link, Typography } from "@mui/material";
import styles from "./Footer.module.css";

export function Footer() {
	return (
		<div className={styles.footerContainer}>
			{/* Starburst decorations */}
			<div className={styles.starbursts}>
				{/* Positioned starbursts around the title */}
				<div className={styles.starburst} style={{ top: '25%', left: '20%', transform: 'rotate(45deg) scale(0.5)' }}>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="white">
						<path d="M12 2 L14 8 L20 8 L15 12 L17 18 L12 14 L7 18 L9 12 L4 8 L10 8 Z" />
					</svg>
				</div>
				<div className={styles.starburst} style={{ top: '18%', left: '75%', transform: 'rotate(120deg) scale(0.4)' }}>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="white">
						<path d="M12 2 L14 8 L20 8 L15 12 L17 18 L12 14 L7 18 L9 12 L4 8 L10 8 Z" />
					</svg>
				</div>
				<div className={styles.starburst} style={{ top: '32%', left: '12%', transform: 'rotate(200deg) scale(0.6)' }}>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="white">
						<path d="M12 2 L14 8 L20 8 L15 12 L17 18 L12 14 L7 18 L9 12 L4 8 L10 8 Z" />
					</svg>
				</div>
				<div className={styles.starburst} style={{ top: '35%', left: '82%', transform: 'rotate(300deg) scale(0.5)' }}>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="white">
						<path d="M12 2 L14 8 L20 8 L15 12 L17 18 L12 14 L7 18 L9 12 L4 8 L10 8 Z" />
					</svg>
				</div>
				<div className={styles.starburst} style={{ top: '22%', left: '45%', transform: 'rotate(15deg) scale(0.4)' }}>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="white">
						<path d="M12 2 L14 8 L20 8 L15 12 L17 18 L12 14 L7 18 L9 12 L4 8 L10 8 Z" />
					</svg>
				</div>
				<div className={styles.starburst} style={{ top: '28%', left: '55%', transform: 'rotate(160deg) scale(0.45)' }}>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="white">
						<path d="M12 2 L14 8 L20 8 L15 12 L17 18 L12 14 L7 18 L9 12 L4 8 L10 8 Z" />
					</svg>
				</div>
				<div className={styles.starburst} style={{ top: '40%', left: '25%', transform: 'rotate(80deg) scale(0.5)' }}>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="white">
						<path d="M12 2 L14 8 L20 8 L15 12 L17 18 L12 14 L7 18 L9 12 L4 8 L10 8 Z" />
					</svg>
				</div>
				<div className={styles.starburst} style={{ top: '38%', left: '70%', transform: 'rotate(240deg) scale(0.4)' }}>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="white">
						<path d="M12 2 L14 8 L20 8 L15 12 L17 18 L12 14 L7 18 L9 12 L4 8 L10 8 Z" />
					</svg>
				</div>
			</div>

			{/* Main Content */}
			<div className={styles.footerContent}>
				{/* Pent Up Title */}
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
					<img 
						src="/Pent.svg" 
						alt="Pent" 
						className={styles.footerLogo}
					/>
					<img 
						src="/Up.svg" 
						alt="Up" 
						className={styles.footerLogo}
					/>
				</Box>

				{/* Tagline */}
				<Typography className={styles.tagline} variant="body2">
					made by spark =)
				</Typography>

				{/* Social Links */}
				<div className={styles.socialLinks}>
					<Link href="https://instagram.com" target="_blank" className={styles.socialLink}>
						Instagram
					</Link>
					<span className={styles.bullet}> • </span>
					<Link href="https://github.com" target="_blank" className={styles.socialLink}>
						GitHub
					</Link>
					<span className={styles.bullet}> • </span>
					<Link href="https://linkedin.com" target="_blank" className={styles.socialLink}>
						LinkedIn
					</Link>
					<span className={styles.bullet}> • </span>
					<Link href="#newsletter" className={styles.socialLink}>
						Newsletter
					</Link>
					<span className={styles.bullet}> • </span>
					<Link href="https://pennclubs.com" target="_blank" className={styles.socialLink}>
						Penn Clubs
					</Link>
				</div>

				{/* Contact */}
				<Typography className={styles.contact}>
					Contact Us:{" "}
					<Link href="mailto:upennspark@gmail.com" className={styles.emailLink}>
						upennspark@gmail.com
					</Link>
				</Typography>
			</div>
		</div>
	);
}
