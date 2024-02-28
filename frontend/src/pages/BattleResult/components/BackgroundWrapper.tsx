import { BackgroundImage } from "@mantine/core";
import BattleBackground from 'assets/images/battle.webp';

export const BattleBackgroundWrapper = ({ children }: { children: React.ReactNode; }) => {
  return (
    <BackgroundImage src={BattleBackground} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'start',

      paddingBlock: '2rem'
    }}>
      {children}
    </BackgroundImage>
  );
};
