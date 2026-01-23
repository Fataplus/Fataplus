import { Composition, Folder } from "remotion";
import { FataplusPromo } from "./compositions/FataplusPromo";
import { FataplusPromoExtended } from "./compositions/FataplusPromoExtended";
import { FataplusVertical } from "./compositions/FataplusVertical";

export const RemotionRoot = () => {
  return (
    <>
      <Folder name="Fataplus-Videos">
        {/* Vidéo courte 6s - Horizontal */}
        <Composition
          id="FataplusPromo"
          component={FataplusPromo}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            theme: {
              primary: "#2D7A3E",
              secondary: "#4CAF50",
              accent: "#FFC107",
              light: "#E8F5E9",
              dark: "#1B5E20",
              text: "#FFFFFF"
            }
          }}
        />

        {/* Vidéo étendue 20s - Horizontal */}
        <Composition
          id="FataplusPromoExtended"
          component={FataplusPromoExtended}
          durationInFrames={600}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            theme: {
              primary: "#2D7A3E",
              secondary: "#4CAF50",
              accent: "#FFC107",
              light: "#E8F5E9",
              dark: "#1B5E20",
              text: "#FFFFFF"
            }
          }}
        />

        <Folder name="Social-Media">
          {/* Vidéo verticale 12s - TikTok/Reels/Shorts */}
          <Composition
            id="FataplusVertical"
            component={FataplusVertical}
            durationInFrames={360}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={{
              theme: {
                primary: "#2D7A3E",
                secondary: "#4CAF50",
                accent: "#FFC107",
                light: "#E8F5E9",
                dark: "#1B5E20",
                text: "#FFFFFF"
              }
            }}
          />
        </Folder>
      </Folder>
    </>
  );
};
