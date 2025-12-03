"use client";

import Link from "next/link";
import styles from "./HomeButton.module.css";

export function HomeButton() {
	return (
		<Link href="/" className={styles.homeButton}>
			<img
				src="/assets/home_button/home_stamp.png"
				alt="Return Home"
				className={styles.homeButtonImage}
			/>
		</Link>
	);
}
