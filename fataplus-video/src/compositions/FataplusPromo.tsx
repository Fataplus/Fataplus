import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Sequence
} from "remotion";
import { fadeIn } from "../components/animations";
import { Logo } from "../components/Logo";
import { ProblemCard } from "../components/ProblemCard";
import { SolutionItem } from "../components/SolutionItem";
import { StatCounter } from "../components/StatCounter";
import { ContactCard } from "../components/ContactCard";
import type { Theme } from "../components/animations";

interface FataplusPromoProps {
  theme: Theme;
}

export const FataplusPromo: React.FC<FataplusPromoProps> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Timeline des scènes (180 frames = 6 secondes à 30fps)
  // Scene 1: Logo intro (0-45 frames = 0-1.5s)
  // Scene 2: Problème (45-90 frames = 1.5-3s)
  // Scene 3: Solution (90-135 frames = 3-4.5s)
  // Scene 4: Stats (135-165 frames = 4.5-5.5s)
  // Scene 5: Contact (165-180 frames = 5.5-6s)

  return (
    <AbsoluteFill style={{ background: theme.light }}>
      {/* Scene 1: Logo Intro */}
      <Sequence from={0} durationInFrames={45}>
        <Logo theme={theme} />
      </Sequence>

      {/* Scene 2: Le Problème */}
      <Sequence from={45} durationInFrames={45}>
        <AbsoluteFill style={{
          background: theme.light,
          padding: 100,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}>
          <h2 style={{
            fontSize: 56,
            color: theme.dark,
            marginBottom: 50,
            textAlign: "center",
            fontWeight: "bold"
          }}>
            Les défis de l'agriculture à Madagascar
          </h2>

          <div style={{
            display: "flex",
            gap: 40,
            justifyContent: "center"
          }}>
            <ProblemCard
              icon="📉"
              title="Accès Limité aux Marchés"
              description="Vente à perte, intermédiaires coûteux"
              delay={0}
              theme={theme}
            />
            <ProblemCard
              icon="🌾"
              title="Méthodes Traditionnelles"
              description="Rendement limité, faible productivité"
              delay={0.3}
              theme={theme}
            />
            <ProblemCard
              icon="📱"
              title="Manque d'Information"
              description="Pas d'accès aux formations modernes"
              delay={0.6}
              theme={theme}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 3: La Solution Fataplus */}
      <Sequence from={90} durationInFrames={45}>
        <AbsoluteFill style={{
          background: theme.light,
          padding: 100,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}>
          <h2 style={{
            fontSize: 56,
            color: theme.dark,
            marginBottom: 60,
            textAlign: "center",
            fontWeight: "bold"
          }}>
            L'Écosystème Fataplus
          </h2>

          <div style={{
            display: "flex",
            gap: 40,
            justifyContent: "center"
          }}>
            <SolutionItem
              icon="📚"
              title="Fiofanana"
              description="Formations agricoles en ligne pour moderniser les pratiques"
              delay={0}
              theme={theme}
            />
            <SolutionItem
              icon="🛒"
              title="Marketplace"
              description="Connexion directe agriculteurs-consommateurs"
              delay={0.2}
              theme={theme}
            />
            <SolutionItem
              icon="👥"
              title="Communauté"
              description="Partage d'expériences et entraide entre agriculteurs"
              delay={0.4}
              theme={theme}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 4: Statistiques */}
      <Sequence from={135} durationInFrames={30}>
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
            fontWeight: "bold"
          }}>
            Notre Impact en 3 Mois
          </h2>

          <div style={{
            display: "flex",
            gap: 100,
            justifyContent: "center",
            alignItems: "center"
          }}>
            <StatCounter
              value={2600}
              label="Agriculteurs"
              delay={0}
              theme={theme}
            />
            <StatCounter
              value={500}
              label="Produits"
              delay={0.2}
              theme={theme}
            />
            <StatCounter
              value={300}
              label="Entreprises"
              delay={0.4}
              theme={theme}
            />
            <StatCounter
              value={540}
              label="ONG & Associations"
              delay={0.6}
              theme={theme}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 5: Contact & CTA */}
      <Sequence from={165} durationInFrames={15}>
        <ContactCard theme={theme} />
      </Sequence>
    </AbsoluteFill>
  );
};
