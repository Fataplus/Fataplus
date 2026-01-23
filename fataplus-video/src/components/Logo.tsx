import React from "react";
import { AbsoluteFill } from "remotion";
import type { Theme } from "./animations";

interface LogoProps {
  theme: Theme;
}

export const Logo: React.FC<LogoProps> = ({ theme }) => {
  return (
    <AbsoluteFill style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column"
    }}>
      {/* Logo stylisé - Folia/Plante */}
      <div style={{
        position: "relative",
        width: 200,
        height: 200
      }}>
        {/* Tige */}
        <div style={{
          position: "absolute",
          left: "50%",
          bottom: 0,
          width: 8,
          height: 100,
          background: theme.primary,
          transform: "translateX(-50%)",
          borderRadius: 4
        }} />
        {/* Feuille gauche */}
        <div style={{
          position: "absolute",
          left: "50%",
          top: 30,
          width: 60,
          height: 30,
          background: theme.secondary,
          transform: "translateX(-100%) rotate(-30deg)",
          borderRadius: "0 100% 0 100%"
        }} />
        {/* Feuille droite */}
        <div style={{
          position: "absolute",
          left: "50%",
          top: 40,
          width: 70,
          height: 35,
          background: theme.primary,
          transform: "translateX(0) rotate(25deg)",
          borderRadius: "100% 0 100% 0"
        }} />
        {/* Feuille centrale */}
        <div style={{
          position: "absolute",
          left: "50%",
          top: 10,
          width: 50,
          height: 80,
          background: theme.secondary,
          transform: "translateX(-50%)",
          borderRadius: "50% 50% 50% 50%"
        }} />
      </div>

      {/* Nom */}
      <h1 style={{
        fontSize: 80,
        fontWeight: "bold",
        color: theme.primary,
        margin: 0,
        letterSpacing: 4
      }}>
        FATA<span style={{ color: theme.accent }}>PLUS</span>
      </h1>

      {/* Tagline */}
      <p style={{
        fontSize: 32,
        color: theme.dark,
        marginTop: 20,
        letterSpacing: 2
      }}>
        Connectez, Cultivez, Prospérez
      </p>
    </AbsoluteFill>
  );
};
