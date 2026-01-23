import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Sequence
} from "remotion";
import { fadeIn, slideInBottom, typewriter } from "../components/animations";
import { ProblemCard } from "../components/ProblemCard";
import { SolutionItem } from "../components/SolutionItem";
import { StatCounter } from "../components/StatCounter";
import { ContactCard } from "../components/ContactCard";
import type { Theme } from "../components/animations";

interface FataplusPromoExtendedProps {
  theme: Theme;
}

// Scène 1: Intro avec logo et slogan
const IntroScene: React.FC<{ theme: Theme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoOpacity = fadeIn(frame, fps, 0);
  const logoScale = interpolate(frame, [0, fps * 0.5], [0.5, 1], {
    extrapolateRight: "clamp",
  });

  const textOpacity = fadeIn(frame, fps, 0.8);

  return (
    <AbsoluteFill style={{
      background: theme.light,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      {/* Logo stylisé avec feuilles */}
      <div style={{
        opacity: logoOpacity,
        transform: `scale(${logoScale})`,
        marginBottom: 40
      }}>
        <div style={{
          position: "relative",
          width: 180,
          height: 180
        }}>
          {/* Tige principale */}
          <div style={{
            position: "absolute",
            left: "50%",
            bottom: 0,
            width: 10,
            height: 90,
            background: theme.primary,
            transform: "translateX(-50%)",
            borderRadius: 5
          }} />
          {/* Grande feuille centrale */}
          <div style={{
            position: "absolute",
            left: "50%",
            top: 10,
            width: 80,
            height: 100,
            background: `linear-gradient(135deg, ${theme.secondary}, ${theme.primary})`,
            transform: "translateX(-50%)",
            borderRadius: "50% 50% 50% 50%",
            boxShadow: `0 10px 30px ${theme.primary}40`
          }} />
          {/* Feuille gauche */}
          <div style={{
            position: "absolute",
            left: "calc(50% - 60px)",
            top: 45,
            width: 55,
            height: 30,
            background: theme.secondary,
            transform: "rotate(-35deg)",
            borderRadius: "0 100% 0 100%"
          }} />
          {/* Feuille droite */}
          <div style={{
            position: "absolute",
            left: "calc(50% + 5px)",
            top: 55,
            width: 65,
            height: 35,
            background: theme.primary,
            transform: "rotate(30deg)",
            borderRadius: "100% 0 100% 0"
          }} />
        </div>
      </div>

      {/* Titre principal */}
      <h1 style={{
        fontSize: 90,
        fontWeight: "bold",
        color: theme.primary,
        margin: "0 0 20px 0",
        letterSpacing: 6,
        opacity: logoOpacity
      }}>
        FATA<span style={{ color: theme.accent }}>PLUS</span>
      </h1>

      {/* Sous-titre */}
      <p style={{
        fontSize: 36,
        color: theme.dark,
        margin: 0,
        opacity: textOpacity,
        letterSpacing: 4
      }}>
        Connectez, Cultivez, Prospérez
      </p>

      {/* Ligne décorative */}
      <div style={{
        width: 200,
        height: 4,
        background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`,
        marginTop: 30,
        opacity: textOpacity
      }} />
    </AbsoluteFill>
  );
};

// Scène 2: L'histoire
const StoryScene: React.FC<{ theme: Theme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = fadeIn(frame, fps, 0);
  const y = slideInBottom(frame, fps, 0);

  return (
    <AbsoluteFill style={{
      background: theme.primary,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 100
    }}>
      <div style={{
        opacity,
        transform: `translateY(${y}px)`,
        maxWidth: 1200,
        textAlign: "center"
      }}>
        <div style={{ fontSize: 80, marginBottom: 30 }}>🌱</div>
        <h2 style={{
          fontSize: 52,
          color: theme.text,
          marginBottom: 30,
          fontWeight: "bold"
        }}>
          Notre Histoire
        </h2>
        <p style={{
          fontSize: 32,
          color: theme.text,
          lineHeight: 1.6,
          opacity: 0.95
        }}>
          Depuis 2006, notre père pépiniériste visionnaire a transformé
          <br />
          <strong style={{ color: theme.accent }}>2362 hectares</strong> de terres arides en zones verdoyantes,
          <br />
          bénéficiant à <strong style={{ color: theme.accent }}>2652 agriculteurs</strong>.
          <br /><br />
          Aujourd'hui, Fataplus digitalise cette révolution pour
          <br />
          toute l'agriculture malgache.
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Scène 3: Les problèmes
const ProblemsScene: React.FC<{ theme: Theme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = fadeIn(frame, fps, 0);

  return (
    <AbsoluteFill style={{
      background: theme.light,
      padding: 80,
      display: "flex",
      flexDirection: "column"
    }}>
      <h2 style={{
        fontSize: 52,
        color: theme.dark,
        marginBottom: 50,
        textAlign: "center",
        fontWeight: "bold",
        opacity: titleOpacity
      }}>
        Les Défis de l'Agriculture à Madagascar
      </h2>

      <div style={{
        display: "flex",
        gap: 35,
        justifyContent: "center",
        flex: 1,
        alignItems: "center"
      }}>
        <ProblemCard
          icon="📉"
          title="Accès Limité aux Marchés"
          description="Vente à perte, intermédiaires coûteux, prix injustes"
          delay={0.2}
          theme={theme}
        />
        <ProblemCard
          icon="🌾"
          title="Méthodes Traditionnelles"
          description="Rendement limité, faible productivité, pratiques obsolètes"
          delay={0.5}
          theme={theme}
        />
        <ProblemCard
          icon="📱"
          title="Manque d'Information"
          description="Pas d'accès aux formations, isolement des communautés"
          delay={0.8}
          theme={theme}
        />
      </div>
    </AbsoluteFill>
  );
};

// Scène 4: La solution
const SolutionsScene: React.FC<{ theme: Theme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = fadeIn(frame, fps, 0);

  return (
    <AbsoluteFill style={{
      background: theme.light,
      padding: 80,
      display: "flex",
      flexDirection: "column"
    }}>
      <h2 style={{
        fontSize: 52,
        color: theme.dark,
        marginBottom: 60,
        textAlign: "center",
        fontWeight: "bold",
        opacity: titleOpacity
      }}>
        L'Écosystème Fataplus
      </h2>

      <div style={{
        display: "flex",
        gap: 35,
        justifyContent: "center",
        flex: 1,
        alignItems: "center"
      }}>
        <SolutionItem
          icon="📚"
          title="Fiofanana"
          description="Formations agricoles en ligne pour moderniser les pratiques de culture"
          delay={0.2}
          theme={theme}
        />
        <SolutionItem
          icon="🛒"
          title="Marketplace"
          description="Connexion directe agriculteurs-consommateurs sans intermédiaires"
          delay={0.4}
          theme={theme}
        />
        <SolutionItem
          icon="👥"
          title="Communauté"
          description="Partage d'expériences, entraide et solidarité entre agriculteurs"
          delay={0.6}
          theme={theme}
        />
      </div>
    </AbsoluteFill>
  );
};

// Scène 5: ODD
const OddScene: React.FC<{ theme: Theme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = fadeIn(frame, fps, 0);

  const goals = [
    { number: "2", title: "Faim Zéro", color: "#DD1367" },
    { number: "8", title: "Travail Décent", color: "#A21942" },
    { number: "9", title: "Innovation", color: "#FD6925" },
    { number: "12", title: "Consommation Responsable", color: "#BF8B2E" },
    { number: "13", title: "Action Climat", color: "#3F7E44" },
  ];

  return (
    <AbsoluteFill style={{
      background: theme.dark,
      padding: 80,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <h2 style={{
        fontSize: 48,
        color: theme.text,
        marginBottom: 50,
        textAlign: "center",
        fontWeight: "bold",
        opacity
      }}>
        Contribuons aux Objectifs de Développement Durable
      </h2>

      <div style={{
        display: "flex",
        gap: 30,
        flexWrap: "wrap",
        justifyContent: "center",
        opacity
      }}>
        {goals.map((goal, i) => (
          <div key={i} style={{
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: goal.color,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold"
          }}>
            <div style={{ fontSize: 48 }}>{goal.number}</div>
            <div style={{ fontSize: 14, textAlign: "center", lineHeight: 1.2 }}>
              {goal.title}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Scène 6: Stats
const StatsScene: React.FC<{ theme: Theme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = fadeIn(frame, fps, 0);

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${theme.primary}, ${theme.dark})`,
      padding: 100,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }}>
      <h2 style={{
        fontSize: 56,
        color: theme.text,
        marginBottom: 80,
        textAlign: "center",
        fontWeight: "bold",
        opacity: titleOpacity
      }}>
        Notre Impact en 3 Mois de Go-To-Market
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "80px 120px",
        justifyItems: "center",
        maxWidth: 1400,
        margin: "0 auto"
      }}>
        <StatCounter value={2600} label="Agriculteurs" delay={0.1} theme={theme} />
        <StatCounter value={500} label="Produits" delay={0.3} theme={theme} />
        <StatCounter value={300} label="Entreprises" delay={0.5} theme={theme} />
        <StatCounter value={540} label="ONG & Associations" delay={0.7} theme={theme} />
        <StatCounter value={300} label="Formations" delay={0.9} theme={theme} />
        <StatCounter value={48} label="Documents de partenariat" delay={1.1} theme={theme} suffix="" />
      </div>
    </AbsoluteFill>
  );
};

export const FataplusPromoExtended: React.FC<FataplusPromoExtendedProps> = ({ theme }) => {
  const { fps } = useVideoConfig();

  // Timeline étendue (600 frames = 20 secondes à 30fps)
  // 0-60: Intro (2s)
  // 60-150: Histoire (3s)
  // 150-270: Problèmes (4s)
  // 270-390: Solutions (4s)
  // 390-480: ODD (3s)
  // 480-570: Stats (3s)
  // 570-600: Contact (1s)

  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={60}>
        <IntroScene theme={theme} />
      </Sequence>

      <Sequence from={60} durationInFrames={90}>
        <StoryScene theme={theme} />
      </Sequence>

      <Sequence from={150} durationInFrames={120}>
        <ProblemsScene theme={theme} />
      </Sequence>

      <Sequence from={270} durationInFrames={120}>
        <SolutionsScene theme={theme} />
      </Sequence>

      <Sequence from={390} durationInFrames={90}>
        <OddScene theme={theme} />
      </Sequence>

      <Sequence from={480} durationInFrames={90}>
        <StatsScene theme={theme} />
      </Sequence>

      <Sequence from={570} durationInFrames={30}>
        <ContactCard theme={theme} />
      </Sequence>
    </AbsoluteFill>
  );
};
