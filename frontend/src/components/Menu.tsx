"use client";

import Link from "next/link";
import styles from "./Menu.module.css";

export function Menu() {
  return (
    <div className={styles.menuWrapper}>
      <img src="/assets/menu/menu (3).png" className={styles.menuBg} alt="" />
      <nav className={styles.menuLinks}>
        <Link href="/" className={styles.menuLink}>
          notes
        </Link>
        <Link href="/about" className={styles.menuLink}>
          about
        </Link>
        <span className={styles.menuSearchPlaceholder} aria-hidden="true" />
      </nav>
    </div>
  );
}

