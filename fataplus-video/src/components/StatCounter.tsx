import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { countUp, fadeIn } from "./animations";
import type { Theme } from "./animations";

interface StatCounterProps {
  value: number;
  label: string;
  suffix?: string;
  delay: number;
  theme: Theme;
}

export const StatCounter: React.FC<StatCounterProps> = ({
  value,
  label,
  suffix = "+",
  delay,
  theme
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = fadeIn(frame, fps, delay);
  const displayValue = countUp(frame, fps, value, 1);

  return (
    <div style={{
      opacity,
      textAlign: "center"
    }}>
      <div style={{
        fontSize: 90,
        fontWeight: "bold",
        color: theme.accent,
        lineHeight: 1
      }}>
        {displayValue}
        <span style={{ fontSize: 60 }}>{suffix}</span>
      </div>
      <div style={{
        fontSize: 28,
        color: theme.text,
        marginTop: 10
      }}>
        {label}
      </div>
    </div>
  );
};
