"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const characters = [
  { name: "Melody", role: "Project Lead", image: "/assets/about_characters/melody.png" },
  { name: "Gia", role: "Project Lead", image: "/assets/about_characters/gia.png" },
  { name: "Gordon", role: "developer", image: "/assets/about_characters/gordon.png" },
  { name: "Ziana", role: "developer", image: "/assets/about_characters/ziana.png" },
  { name: "Sam", role: "developer", image: "/assets/about_characters/sam.png" },
  { name: "Fiona", role: "designer", image: "/assets/about_characters/fiona.png" },
  { name: "Zara", role: "designer", image: "/assets/about_characters/zara.png" },
];

export default function AboutPage() {
  const [isFionaPopupOpen, setIsFionaPopupOpen] = useState(false);
  const [isSamPopupOpen, setIsSamPopupOpen] = useState(false);
  const [isGiaPopupOpen, setIsGiaPopupOpen] = useState(false);
  const [isMelodyPopupOpen, setIsMelodyPopupOpen] = useState(false);
  const [isZaraPopupOpen, setIsZaraPopupOpen] = useState(false);
  const [isGordonPopupOpen, setIsGordonPopupOpen] = useState(false);
  const [isZianaPopupOpen, setIsZianaPopupOpen] = useState(false);

  const handleFionaClick = () => {
    setIsFionaPopupOpen(true);
  };

  const handleSamClick = () => {
    setIsSamPopupOpen(true);
  };

  const handleGiaClick = () => {
    setIsGiaPopupOpen(true);
  };

  const handleMelodyClick = () => {
    setIsMelodyPopupOpen(true);
  };

  const handleZaraClick = () => {
    setIsZaraPopupOpen(true);
  };

  const handleGordonClick = () => {
    setIsGordonPopupOpen(true);
  };

  const handleZianaClick = () => {
    setIsZianaPopupOpen(true);
  };

  const handleCloseFionaPopup = () => {
    setIsFionaPopupOpen(false);
  };

  const handleCloseSamPopup = () => {
    setIsSamPopupOpen(false);
  };

  const handleCloseGiaPopup = () => {
    setIsGiaPopupOpen(false);
  };

  const handleCloseMelodyPopup = () => {
    setIsMelodyPopupOpen(false);
  };

  const handleCloseZaraPopup = () => {
    setIsZaraPopupOpen(false);
  };

  const handleCloseGordonPopup = () => {
    setIsGordonPopupOpen(false);
  };

  const handleCloseZianaPopup = () => {
    setIsZianaPopupOpen(false);
  };

  return (
    <div className={styles.aboutContainer}>
      {/* Fixed Home Button */}
      <Link href="/" className={styles.homeButton}>
        <img
          src="/assets/home_button/home_stamp.png"
          alt="Return Home"
          className={styles.homeButtonImage}
        />
      </Link>

      {/* Main content wrapper */}
      <div className={styles.contentWrapper}>
        {/* Left panel - About card SVG */}
        <div className={styles.aboutPanel}>
          <img
            src="/assets/about_card/Group%2015.svg"
            alt="About Pent Up"
            className={styles.aboutCard}
          />
        </div>
        
        {/* Right section - Character grid */}
        <div className={styles.charactersSection}>
          {/* Row 1: Melody and Gia */}
          <div className={styles.characterRow}>
            {characters.filter(c => c.name === "Melody" || c.name === "Gia").map((character) => (
              <div 
                key={character.name} 
                className={`${styles.characterCard} ${character.name === "Fiona" || character.name === "Gia" || character.name === "Melody" ? styles.clickableCard : ""}`}
                onClick={character.name === "Fiona" ? handleFionaClick : character.name === "Gia" ? handleGiaClick : character.name === "Melody" ? handleMelodyClick : undefined}
              >
                <img
                  src={character.image}
                  alt={character.name}
                  className={styles.characterImage}
                />
                <div className={styles.characterInfo}>
                  <div className={styles.characterName}>{character.name}:</div>
                  <div className={styles.characterRole}>{character.role}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Row 2: Gordon, Ziana, and Sam */}
          <div className={styles.characterRow}>
            {characters.filter(c => c.name === "Gordon" || c.name === "Ziana" || c.name === "Sam").map((character) => (
              <div 
                key={character.name} 
                className={`${styles.characterCard} ${character.name === "Fiona" || character.name === "Sam" || character.name === "Gordon" || character.name === "Ziana" ? styles.clickableCard : ""}`}
                onClick={character.name === "Fiona" ? handleFionaClick : character.name === "Sam" ? handleSamClick : character.name === "Gordon" ? handleGordonClick : character.name === "Ziana" ? handleZianaClick : undefined}
              >
                <img
                  src={character.image}
                  alt={character.name}
                  className={styles.characterImage}
                />
                <div className={styles.characterInfo}>
                  <div className={styles.characterName}>{character.name}:</div>
                  <div className={styles.characterRole}>{character.role}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Row 3: Fiona and Zara */}
          <div className={styles.characterRow}>
            {characters.filter(c => c.name === "Fiona" || c.name === "Zara").map((character) => (
              <div 
                key={character.name} 
                className={`${styles.characterCard} ${character.name === "Fiona" || character.name === "Zara" ? styles.clickableCard : ""}`}
                onClick={character.name === "Fiona" ? handleFionaClick : character.name === "Zara" ? handleZaraClick : undefined}
              >
                <img
                  src={character.image}
                  alt={character.name}
                  className={styles.characterImage}
                />
                <div className={styles.characterInfo}>
                  <div className={styles.characterName}>{character.name}:</div>
                  <div className={styles.characterRole}>{character.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Info Section */}
      <div className={styles.contactInfoSection}>
        <img
          src="/assets/contact_info/Group%2096%20(1).png"
          alt="Contact Info"
          className={styles.contactInfoImage}
        />
        <div className={styles.contactInfoOverlay}>
          <div className={styles.contactLinks}>
            <a href="https://www.instagram.com/pent.up.project/" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
              Instagram
            </a>
            <span className={styles.contactSeparator}> • </span>
            <a href="https://github.com/ziana-sundrani/pent_up" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
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
          </div>
          <div className={styles.contactEmail}>
            Contact Us: <a href="mailto:upennspark@gmail.com" className={styles.contactLink}>upennspark@gmail.com</a>
          </div>
        </div>
      </div>

      {/* Fiona Popup Modal */}
      {isFionaPopupOpen && (
        <div className={styles.popupOverlay} onClick={handleCloseFionaPopup}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.popupImageContainer}>
              <button className={styles.exitButton} onClick={handleCloseFionaPopup}>
                <img
                  src="/assets/exit_button/exit button.png"
                  alt="Close"
                  className={styles.exitButtonImage}
                />
              </button>
              <img
                src="/assets/about_fiona_popup/Pop-up%20about.svg"
                alt="Fiona Popup"
                className={styles.popupImage}
              />
            </div>
          </div>
        </div>
      )}

      {/* Sam Popup Modal */}
      {isSamPopupOpen && (
        <div className={styles.popupOverlay} onClick={handleCloseSamPopup}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.popupImageContainer}>
              <button className={styles.exitButton} onClick={handleCloseSamPopup}>
                <img
                  src="/assets/exit_button/exit button.png"
                  alt="Close"
                  className={styles.exitButtonImage}
                />
              </button>
              <img
                src="/assets/about_sam_popup/sam%20Pop-up%20about.svg"
                alt="Sam Popup"
                className={styles.popupImage}
              />
              <a
                href="https://www.linkedin.com/in/seohyun-sam-park-54796828b/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.samLinkedInLink}
              >
                @Seohyun (Sam) Park
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Gia Popup Modal */}
      {isGiaPopupOpen && (
        <div className={styles.popupOverlay} onClick={handleCloseGiaPopup}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.popupImageContainer}>
              <button className={styles.exitButton} onClick={handleCloseGiaPopup}>
                <img
                  src="/assets/exit_button/exit button.png"
                  alt="Close"
                  className={styles.exitButtonImage}
                />
              </button>
              <img
                src="/assets/about_gia_popup/Gia%20Pop-up%20about.svg"
                alt="Gia Popup"
                className={styles.popupImage}
              />
            </div>
          </div>
        </div>
      )}

      {/* Melody Popup Modal */}
      {isMelodyPopupOpen && (
        <div className={styles.popupOverlay} onClick={handleCloseMelodyPopup}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.popupImageContainer}>
              <button className={styles.exitButton} onClick={handleCloseMelodyPopup}>
                <img
                  src="/assets/exit_button/exit button.png"
                  alt="Close"
                  className={styles.exitButtonImage}
                />
              </button>
              <img
                src="/assets/about_melody_popup/Melody%20Pop-up%20about.png"
                alt="Melody Popup"
                className={styles.popupImage}
              />
              <a
                href="https://www.linkedin.com/in/melody-zhang-90605b217/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.melodyLinkedInLink}
              >
                @Melody Zhang
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Zara Popup Modal */}
      {isZaraPopupOpen && (
        <div className={styles.popupOverlay} onClick={handleCloseZaraPopup}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.popupImageContainer}>
              <button className={styles.exitButton} onClick={handleCloseZaraPopup}>
                <img
                  src="/assets/exit_button/exit button.png"
                  alt="Close"
                  className={styles.exitButtonImage}
                />
              </button>
              <img
                src="/assets/about_zara_popup/Pop-up%20about.png"
                alt="Zara Popup"
                className={styles.popupImage}
              />
            </div>
          </div>
        </div>
      )}

      {/* Gordon Popup Modal */}
      {isGordonPopupOpen && (
        <div className={styles.popupOverlay} onClick={handleCloseGordonPopup}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.popupImageContainer}>
              <button className={styles.exitButton} onClick={handleCloseGordonPopup}>
                <img
                  src="/assets/exit_button/exit button.png"
                  alt="Close"
                  className={styles.exitButtonImage}
                />
              </button>
              <img
                src="/assets/about_gordon_popup/gordon_popup.svg"
                alt="Gordon Popup"
                className={styles.popupImage}
              />
            </div>
          </div>
        </div>
      )}

      {/* Ziana Popup Modal */}
      {isZianaPopupOpen && (
        <div className={styles.popupOverlay} onClick={handleCloseZianaPopup}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.popupImageContainer}>
              <button className={styles.exitButton} onClick={handleCloseZianaPopup}>
                <img
                  src="/assets/exit_button/exit button.png"
                  alt="Close"
                  className={styles.exitButtonImage}
                />
              </button>
              <img
                src="/assets/about_ziana_popup/ziana_popup.png"
                alt="Ziana Popup"
                className={styles.popupImage}
              />
              <a
                href="https://www.linkedin.com/in/ziana-sundrani/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.zianaLinkedInLink}
              >
                @ZianaSundrani
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

