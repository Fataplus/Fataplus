import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  Sequence
} from "remotion";
import { fadeIn, scaleIn } from "../components/animations";
import type { Theme } from "../components/animations";

interface FataplusVerticalProps {
  theme: Theme;
}

// Scene 1: Logo Intro
const LogoIntro: React.FC<{ theme: Theme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = fadeIn(frame, fps, 0);
  const scale = scaleIn(frame, fps, 0);

  return (
    <AbsoluteFill style={{
      background: theme.light,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 30
    }}>
      {/* Logo emoji simplifié */}
      <div style={{
        opacity,
        transform: `scale(${scale})`,
        fontSize: 150
      }}>
        🌱
      </div>

      <h1 style={{
        fontSize: 70,
        fontWeight: "bold",
        color: theme.primary,
        margin: 0,
        opacity
      }}>
        FATA<span style={{ color: theme.accent }}>PLUS</span>
      </h1>

      <p style={{
        fontSize: 28,
        color: theme.dark,
        margin: 0,
        opacity,
        textAlign: "center",
        paddingInline: 40
      }}>
        Connectez, Cultivez, Prospérez
      </p>
    </AbsoluteFill>
  );
};

// Scene 2: Problem
const ProblemSlide: React.FC<{ theme: Theme; icon: string; title: string; desc: string }> =
  ({ theme, icon, title, desc }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const opacity = fadeIn(frame, fps, 0);
    const scale = scaleIn(frame, fps, 0);

    return (
      <AbsoluteFill style={{
        background: theme.primary,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
        gap: 30
      }}>
        <div style={{
          opacity,
          transform: `scale(${scale})`,
          fontSize: 120
        }}>
          {icon}
        </div>

        <h2 style={{
          fontSize: 48,
          color: theme.text,
          margin: 0,
          textAlign: "center",
          opacity
        }}>
          {title}
        </h2>

        <p style={{
          fontSize: 32,
          color: theme.text,
          margin: 0,
          textAlign: "center",
          opacity,
          lineHeight: 1.4
        }}>
          {desc}
        </p>
      </AbsoluteFill>
    );
  };

// Scene 3: Solution
const SolutionSlide: React.FC<{ theme: Theme; icon: string; title: string; desc: string }> =
  ({ theme, icon, title, desc }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const opacity = fadeIn(frame, fps, 0);
    const scale = scaleIn(frame, fps, 0);

    return (
      <AbsoluteFill style={{
        background: `linear-gradient(180deg, ${theme.secondary}, ${theme.primary})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
        gap: 30
      }}>
        <div style={{
          opacity,
          transform: `scale(${scale})`,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: theme.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 50
        }}>
          {icon}
        </div>

        <h2 style={{
          fontSize: 48,
          color: theme.text,
          margin: 0,
          textAlign: "center",
          opacity
        }}>
          {title}
        </h2>

        <p style={{
          fontSize: 28,
          color: theme.text,
          margin: 0,
          textAlign: "center",
          opacity,
          lineHeight: 1.4
        }}>
          {desc}
        </p>
      </AbsoluteFill>
    );
  };

// Scene 4: Stats
const StatsSlide: React.FC<{ theme: Theme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = fadeIn(frame, fps, 0);

  const stats = [
    { value: 2600, label: "Agriculteurs" },
    { value: 500, label: "Produits" },
    { value: 300, label: "Entreprises" },
  ];

  return (
    <AbsoluteFill style={{
      background: theme.dark,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 60,
      gap: 40
    }}>
      <h2 style={{
        fontSize: 42,
        color: theme.text,
        margin: 0,
        textAlign: "center",
        opacity
      }}>
        Notre Impact
      </h2>

      {stats.map((stat, i) => (
        <div key={i} style={{
          opacity,
          textAlign: "center"
        }}>
          <div style={{
            fontSize: 70,
            fontWeight: "bold",
            color: theme.accent
          }}>
            {stat.value}+
          </div>
          <div style={{
            fontSize: 28,
            color: theme.text
          }}>
            {stat.label}
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

// Scene 5: CTA
const CTASlide: React.FC<{ theme: Theme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = fadeIn(frame, fps, 0);

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, ${theme.primary}, ${theme.dark})`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 60,
      gap: 30
    }}>
      <h1 style={{
        fontSize: 60,
        fontWeight: "bold",
        color: theme.text,
        margin: 0,
        textAlign: "center",
        opacity
      }}>
        FATA<span style={{ color: theme.accent }}>PLUS</span>
      </h1>

      <p style={{
        fontSize: 28,
        color: theme.text,
        margin: 0,
        textAlign: "center",
        opacity
      }}>
        🌐 fata.plus
      </p>

      <div style={{
        marginTop: 40,
        padding: "20px 50px",
        background: theme.accent,
        borderRadius: 40,
        fontSize: 32,
        fontWeight: "bold",
        color: theme.dark,
        opacity
      }}>
        Rejoignez-nous !
      </div>
    </AbsoluteFill>
  );
};

export const FataplusVertical: React.FC<FataplusVerticalProps> = ({ theme }) => {
  // Timeline verticale (360 frames = 12 secondes à 30fps)
  // Format 1080x1920 pour TikTok/Reels/Shorts

  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={45}>
        <LogoIntro theme={theme} />
      </Sequence>

      <Sequence from={45} durationInFrames={45}>
        <ProblemSlide
          theme={theme}
          icon="📉"
          title="Accès Limité aux Marchés"
          desc="Les agriculteurs vendent à perte"
        />
      </Sequence>

      <Sequence from={90} durationInFrames={45}>
        <ProblemSlide
          theme={theme}
          icon="🌾"
          title="Méthodes Traditionnelles"
          desc="Rendement et productivité limités"
        />
      </Sequence>

      <Sequence from={135} durationInFrames={45}>
        <SolutionSlide
          theme={theme}
          icon="📚"
          title="Fiofanana"
          desc="Formations agricoles en ligne"
        />
      </Sequence>

      <Sequence from={180} durationInFrames={45}>
        <SolutionSlide
          theme={theme}
          icon="🛒"
          title="Marketplace"
          desc="Achetez et vendez directement"
        />
      </Sequence>

      <Sequence from={225} durationInFrames={45}>
        <SolutionSlide
          theme={theme}
          icon="👥"
          title="Communauté"
          desc="Entrez solidaires entre agriculteurs"
        />
      </Sequence>

      <Sequence from={270} durationInFrames={45}>
        <StatsSlide theme={theme} />
      </Sequence>

      <Sequence from={315} durationInFrames={45}>
        <CTASlide theme={theme} />
      </Sequence>
    </AbsoluteFill>
  );
};
