"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSearch } from "@/contexts/SearchContext";
import styles from "./Menu.module.css";

export function Menu() {
  const { searchQuery, setSearchQuery, isExpanded, setIsExpanded } = useSearch();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const hasScrolledRef = React.useRef(false);
  const router = useRouter();
  const pathname = usePathname();

  // Collapse the menu whenever we navigate away from the notes page
  React.useEffect(() => {
    if (pathname !== "/") {
      setIsExpanded(false);
      setSearchQuery("");
      hasScrolledRef.current = false;
    }
  }, [pathname, setIsExpanded, setSearchQuery]);

  const handleNotesClick = (e?: React.MouseEvent) => {
    inputRef.current?.blur();
    setSearchQuery("");
    setIsExpanded(false);
    hasScrolledRef.current = false;
    if (pathname !== "/") {
      router.push("/");
    }
  };

  const handleAboutClick = (e?: React.MouseEvent) => {
    // Collapse the search; allow the Link to handle navigation
    inputRef.current?.blur();
    setSearchQuery("");
    setIsExpanded(false);
    hasScrolledRef.current = false;
  };

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

  // Ensure input focuses when expanded (helps on mobile to open the keyboard)
  React.useEffect(() => {
    if (isExpanded) {
      const focusInput = () => inputRef.current?.focus();
      // Try immediately, then after animation
      focusInput();
      const id = setTimeout(focusInput, 120);
      return () => clearTimeout(id);
    }
  }, [isExpanded]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // If user is on another page (e.g., about), route back to notes before filtering
    if (pathname !== "/") {
      router.push("/");
    }
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
              placeholder="Search for your initials"
              className={styles.menuSearchInput}
              maxLength={10}
            />
          </nav>
          {/* Clickable overlays for links and search icon in the expanded image */}
          <Link
            href="/"
            className={styles.menuLinkOverlay}
            aria-label="Notes"
            onClick={handleNotesClick}
          />
          <Link
            href="/about"
            className={styles.menuAboutOverlay}
            aria-label="About"
            onClick={handleAboutClick}
          />
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
            <Link href="/about" className={styles.menuLink} onClick={handleAboutClick}>
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

