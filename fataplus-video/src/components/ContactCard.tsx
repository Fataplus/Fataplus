import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { fadeIn, scaleIn } from "./animations";
import { Logo } from "./Logo";
import type { Theme } from "./animations";

interface ContactCardProps {
  theme: Theme;
}

export const ContactCard: React.FC<ContactCardProps> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoOpacity = fadeIn(frame, fps, 0);
  const logoScale = scaleIn(frame, fps, 0);

  const textOpacity = fadeIn(frame, fps, 1);

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, ${theme.primary}, ${theme.dark})`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      {/* Logo version simplifiée */}
      <div style={{
        opacity: logoOpacity,
        transform: `scale(${logoScale})`,
        marginBottom: 60
      }}>
        <h1 style={{
          fontSize: 100,
          fontWeight: "bold",
          color: theme.text,
          margin: 0,
          letterSpacing: 4
        }}>
          FATA<span style={{ color: theme.accent }}>PLUS</span>
        </h1>
      </div>

      {/* Tagline */}
      <p style={{
        fontSize: 40,
        color: theme.text,
        opacity: textOpacity,
        marginBottom: 80,
        letterSpacing: 3
      }}>
        Connectez, Cultivez, Prospérez
      </p>

      {/* Contact info */}
      <div style={{
        opacity: textOpacity,
        display: "flex",
        flexDirection: "column",
        gap: 25,
        alignItems: "center"
      }}>
        <div style={{
          fontSize: 32,
          color: theme.text,
          display: "flex",
          alignItems: "center",
          gap: 15
        }}>
          <span>🌐</span>
          <span>fata.plus</span>
        </div>
        <div style={{
          fontSize: 32,
          color: theme.text,
          display: "flex",
          alignItems: "center",
          gap: 15
        }}>
          <span>📧</span>
          <span>contact@fata.plus</span>
        </div>
        <div style={{
          fontSize: 32,
          color: theme.text,
          display: "flex",
          alignItems: "center",
          gap: 15
        }}>
          <span>📱</span>
          <span>+261 34 20 472 13</span>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        marginTop: 80,
        padding: "25px 60px",
        background: theme.accent,
        borderRadius: 50,
        fontSize: 36,
        fontWeight: "bold",
        color: theme.dark,
        opacity: textOpacity
      }}>
        Rejoignez la révolution agricole !
      </div>
    </AbsoluteFill>
  );
};
