"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { HomeButton } from "@/components/HomeButton";

const characters = [
  { name: "Melody", role: "Project Lead", image: "/assets/about_characters/melody.png" },
  { name: "Gia", role: "Project Lead", image: "/assets/about_characters/gia.png" },
  { name: "Gordon", role: "developer", image: "/assets/about_characters/gordon.png" },
  { name: "Ziana", role: "developer", image: "/assets/about_characters/ziana.png" },
  { name: "Sam", role: "developer", image: "/assets/about_characters/sam.png" },
  { name: "Fiona", role: "designer", image: "/assets/about_characters/fiona.png" },
  { name: "Zara", role: "designer", image: "/assets/about_characters/zara.png" },
];

type CharacterName = "Fiona" | "Sam" | "Gia" | "Melody" | "Zara" | "Gordon" | "Ziana";

export default function AboutPage() {
  const [openPopup, setOpenPopup] = useState<CharacterName | null>(null);

  const handleCharacterClick = (name: string) => {
    setOpenPopup(name as CharacterName);
  };

  const handleClosePopup = () => {
    setOpenPopup(null);
  };

  return (
    <div className={styles.aboutContainer}>
      {/* Fixed Home Button */}
      <HomeButton />

      {/* Main content wrapper */}
      <div className={styles.contentWrapper}>
        {/* Left panel - About card SVG */}
        <div className={styles.aboutPanel}>
          <img
            src="/assets/about_card/Group%2015.png"
            alt="About Pent Up"
            className={styles.aboutCard}
          />
        </div>
        
        {/* Right section - Character rows */}
        <div className={styles.charactersSection}>
          {/* Row 1: Melody and Gia */}
          <div className={styles.characterRow}>
            {characters.filter(c => c.name === "Melody" || c.name === "Gia").map((character) => (
              <div 
                key={character.name} 
                className={`${styles.characterCard} ${styles.clickableCard}`}
                onClick={() => handleCharacterClick(character.name)}
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
                className={`${styles.characterCard} ${styles.clickableCard}`}
                onClick={() => handleCharacterClick(character.name)}
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
                className={`${styles.characterCard} ${styles.clickableCard}`}
                onClick={() => handleCharacterClick(character.name)}
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
      {openPopup === "Fiona" && (
        <div className={styles.popupOverlay} onClick={handleClosePopup}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.popupImageContainer}>
              <button className={styles.exitButton} onClick={handleClosePopup}>
                <img
                  src="/assets/exit_button/exit button.png"
                  alt="Close"
                  className={styles.exitButtonImage}
                />
              </button>
              <img
                src="/assets/about_fiona_popup/Pop-up%20about.png"
                alt="Fiona Popup"
                className={styles.popupImage}
              />
            </div>
          </div>
        </div>
      )}

      {/* Sam Popup Modal */}
      {openPopup === "Sam" && (
        <div className={styles.popupOverlay} onClick={handleClosePopup}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.popupImageContainer}>
              <button className={styles.exitButton} onClick={handleClosePopup}>
                <img
                  src="/assets/exit_button/exit button.png"
                  alt="Close"
                  className={styles.exitButtonImage}
                />
              </button>
              <img
                src="/assets/about_sam_popup/Sam About (1).png"
                alt="Sam Popup"
                className={styles.popupImage}
              />
              <a
                href="https://www.linkedin.com/in/seohyun-sam-park-54796828b/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.samLinkedInClickArea}
                aria-label="LinkedIn Profile"
              />
              <a
                href="mailto:sampark@sas.upenn.edu"
                className={styles.samEmailClickArea}
                aria-label="Email"
              />
            </div>
          </div>
        </div>
      )}

      {/* Gia Popup Modal */}
      {openPopup === "Gia" && (
        <div className={styles.popupOverlay} onClick={handleClosePopup}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.popupImageContainer}>
              <button className={styles.exitButton} onClick={handleClosePopup}>
                <img
                  src="/assets/exit_button/exit button.png"
                  alt="Close"
                  className={styles.exitButtonImage}
                />
              </button>
              <img
                src="/assets/about_gia_popup/Gia%20Pop-up%20about%20(3).png"
                alt="Gia Popup"
                className={styles.popupImage}
              />
            </div>
          </div>
        </div>
      )}

      {/* Melody Popup Modal */}
      {openPopup === "Melody" && (
        <div className={styles.popupOverlay} onClick={handleClosePopup}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.popupImageContainer}>
              <button className={styles.exitButton} onClick={handleClosePopup}>
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
      {openPopup === "Zara" && (
        <div className={styles.popupOverlay} onClick={handleClosePopup}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.popupImageContainer}>
              <button className={styles.exitButton} onClick={handleClosePopup}>
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
      {openPopup === "Gordon" && (
        <div className={styles.popupOverlay} onClick={handleClosePopup}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.popupImageContainer}>
              <button className={styles.exitButton} onClick={handleClosePopup}>
                <img
                  src="/assets/exit_button/exit button.png"
                  alt="Close"
                  className={styles.exitButtonImage}
                />
              </button>
              <img
                src="/assets/about_gordon_popup/Gordon%20Pop-up%20about.png"
                alt="Gordon Popup"
                className={styles.popupImage}
              />
            </div>
          </div>
        </div>
      )}

      {/* Ziana Popup Modal */}
      {openPopup === "Ziana" && (
        <div className={styles.popupOverlay} onClick={handleClosePopup}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.popupImageContainer}>
              <button className={styles.exitButton} onClick={handleClosePopup}>
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
