import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { scaleIn, fadeIn } from "./animations";
import type { Theme } from "./animations";

interface SolutionItemProps {
  icon: string;
  title: string;
  description: string;
  delay: number;
  theme: Theme;
}

export const SolutionItem: React.FC<SolutionItemProps> = ({
  icon,
  title,
  description,
  delay,
  theme
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = fadeIn(frame, fps, delay);
  const scale = scaleIn(frame, fps, delay);

  return (
    <div style={{
      opacity,
      transform: `scale(${scale})`,
      background: `linear-gradient(135deg, ${theme.primary}, ${theme.dark})`,
      padding: 35,
      borderRadius: 20,
      color: theme.text,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      gap: 15,
      minWidth: 300
    }}>
      <div style={{
        fontSize: 70,
        background: theme.accent,
        width: 120,
        height: 120,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        {icon}
      </div>
      <h3 style={{
        fontSize: 36,
        margin: 0,
        fontWeight: "bold"
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: 22,
        margin: 0,
        opacity: 0.9,
        lineHeight: 1.4
      }}>
        {description}
      </p>
    </div>
  );
};
