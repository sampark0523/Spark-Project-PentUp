"use client";

import * as React from "react";
import Link from "next/link";
import { useSearch } from "@/contexts/SearchContext";
import styles from "./Menu.module.css";

export function Menu() {
  const { searchQuery, setSearchQuery, isExpanded, setIsExpanded } = useSearch();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const hasScrolledRef = React.useRef(false);

  // Scroll down when user starts typing
  React.useEffect(() => {
    if (searchQuery.trim() && !hasScrolledRef.current) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const contentBox = document.querySelector('[data-message-content]');
        if (contentBox) {
          const rect = contentBox.getBoundingClientRect();
          const scrollPosition = window.scrollY + rect.top - 100; // 100px offset from top
          window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
        } else {
          // Fallback: scroll down a reasonable amount
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }
        hasScrolledRef.current = true;
      }, 100);
    } else if (!searchQuery.trim()) {
      // Reset scroll flag when search is cleared
      hasScrolledRef.current = false;
    }
  }, [searchQuery]);

  const handleSearchIconClick = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      // Focus input after expansion animation
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      // Clear search when collapsing
      setSearchQuery("");
      hasScrolledRef.current = false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleInputBlur = () => {
    // Don't collapse if there's text in the input
    if (!searchQuery.trim()) {
      setIsExpanded(false);
    }
  };

  return (
    <div className={`${styles.menuWrapper} ${isExpanded ? styles.expanded : ""}`}>
      <img 
        src={isExpanded ? "/assets/expanded menu.png" : "/assets/menu/menu (3).png"} 
        className={styles.menuBg} 
        alt="" 
      />
      {isExpanded ? (
        <>
          {/* Only show input field when expanded - links and search icon are in the image */}
          <nav className={styles.menuLinks}>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder=""
              className={styles.menuSearchInput}
              maxLength={10}
            />
          </nav>
          {/* Clickable overlays for links and search icon in the expanded image */}
          <Link href="/" className={styles.menuLinkOverlay} />
          <Link href="/about" className={styles.menuAboutOverlay} />
          <button
            onClick={handleSearchIconClick}
            className={styles.menuSearchIconOverlay}
            aria-label="Close search"
          />
        </>
      ) : (
        <>
          <nav className={styles.menuLinks}>
            <Link href="/" className={styles.menuLink}>
              notes
            </Link>
            <Link href="/about" className={styles.menuLink}>
              about
            </Link>
          </nav>
          {/* Clickable overlay for search icon in collapsed image */}
          <button
            onClick={handleSearchIconClick}
            className={styles.menuSearchIconOverlay}
            aria-label="Search"
          />
        </>
      )}
    </div>
  );
}

