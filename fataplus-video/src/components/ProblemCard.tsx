import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { slideInLeft, fadeIn } from "./animations";
import type { Theme } from "./animations";

interface ProblemCardProps {
  icon: string;
  title: string;
  description: string;
  delay: number;
  theme: Theme;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({
  icon,
  title,
  description,
  delay,
  theme
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = fadeIn(frame, fps, delay);
  const x = slideInLeft(frame, fps, delay);

  return (
    <div style={{
      opacity,
      transform: `translateX(${x}px)`,
      background: theme.light,
      padding: 40,
      borderRadius: 20,
      display: "flex",
      gap: 30,
      alignItems: "flex-start"
    }}>
      <div style={{
        fontSize: 60,
        minWidth: 80,
        textAlign: "center"
      }}>
        {icon}
      </div>
      <div>
        <h3 style={{
          fontSize: 32,
          color: theme.dark,
          margin: "0 0 10px 0",
          fontWeight: "bold"
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: 24,
          color: theme.primary,
          margin: 0,
          lineHeight: 1.4
        }}>
          {description}
        </p>
      </div>
    </div>
  );
};
