import { interpolate, spring } from "remotion";

export type Theme = {
  primary: string;
  secondary: string;
  accent: string;
  light: string;
  dark: string;
  text: string;
};

// Fade in animation
export const fadeIn = (frame: number, fps: number, delay = 0) => {
  const startFrame = delay * fps;
  return interpolate(frame, [startFrame, startFrame + fps], [0, 1], {
    extrapolateRight: "clamp",
  });
};

// Fade out animation
export const fadeOut = (frame: number, fps: number, duration: number) => {
  return interpolate(
    frame,
    [duration - fps, duration],
    [1, 0],
    {
      extrapolateLeft: "clamp",
    }
  );
};

// Scale animation with spring
export const scaleIn = (frame: number, fps: number, delay = 0) => {
  const startFrame = delay * fps;
  return spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: 12,
      stiffness: 80,
      mass: 1,
    },
  });
};

// Slide from left
export const slideInLeft = (frame: number, fps: number, delay = 0) => {
  const startFrame = delay * fps;
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: 15,
      stiffness: 100,
    },
  });
  return interpolate(progress, [0, 1], [-100, 0]);
};

// Slide from right
export const slideInRight = (frame: number, fps: number, delay = 0) => {
  const startFrame = delay * fps;
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: 15,
      stiffness: 100,
    },
  });
  return interpolate(progress, [0, 1], [100, 0]);
};

// Slide from bottom
export const slideInBottom = (frame: number, fps: number, delay = 0) => {
  const startFrame = delay * fps;
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: 15,
      stiffness: 100,
    },
  });
  return interpolate(progress, [0, 1], [100, 0]);
};

// Typewriter effect
export const typewriter = (frame: number, fps: number, text: string, speed = 0.05) => {
  const charsToShow = Math.floor(frame * fps * speed);
  return text.slice(0, charsToShow);
};

// Count up animation
export const countUp = (frame: number, fps: number, end: number, duration = 1) => {
  return Math.min(
    Math.floor(interpolate(frame, [0, duration * fps], [0, end + 1])),
    end
  );
};
