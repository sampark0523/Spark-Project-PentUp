"use client";

import * as React from "react";
import styles from "./Footer.module.css";

export function Footer() {
	return (
		<div className={styles.footerContainer}>
			<img
				src="/assets/landing-footer.png"
				alt="Footer"
				className={styles.footerImage}
			/>
			<div className={styles.footerOverlay}>
				<div className={styles.contactLinks}>
					<a href="https://www.instagram.com/pent.up.project/" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
						Instagram
					</a>
					<span className={styles.contactSeparator}> • </span>
					<a href="https://github.com/sampark0523/Spark-Project-PentUp" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
						GitHub
					</a>
					<span className={styles.contactSeparator}> • </span>
					<a href="https://www.linkedin.com/company/pennspark/" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
						LinkedIn
					</a>
					<span className={styles.contactSeparator}> • </span>
					<a href="https://pennspark.substack.com/" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
						Newsletter
					</a>
					<span className={styles.contactSeparator}> • </span>
					<a href="https://pennclubs.com/club/penn-spark/" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
						Penn Clubs
					</a>
					<span className={styles.contactSeparator}> • </span>
					<a href="https://spark-website-alpha.vercel.app/" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
						Spark Website
					</a>
				</div>
				<div className={styles.contactEmail}>
					Contact Us: <a href="mailto:upennspark@gmail.com" className={styles.contactLink}>upennspark@gmail.com</a>
				</div>
			</div>
		</div>
	);
}
