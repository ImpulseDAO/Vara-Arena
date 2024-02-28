import clsx from 'clsx';
import { Flex, Image, Text, Title } from '@mantine/core';
//
import customClassImage from 'assets/images/classes/custom-class.webp';
import knightImage from 'assets/images/classes/knight.webp';
import rogueImage from 'assets/images/classes/rogue.webp';
import fireMageImage from 'assets/images/classes/fire-mage.webp';
//
import { TheButton } from 'components/TheButton';
import styles from './SelectClass.module.css';
import { PanelWithHeader } from 'components/PanelWithHeader/PanelWithHeader';
import { routes } from 'app/routes';
import { useNavigate } from 'react-router-dom';
import { Specialization } from 'consts';

const characterClasses: Array<{
  key: Specialization;
  buttonText: string;
  description: string;
  imageSrc: string;
}> = [
    {
      key: "knight",
      buttonText: "Pick a Knight",
      description: "Knights are great for countering Rogues. High STR allows them to deal a huge physical damage with heavy attacks in melee.",
      imageSrc: knightImage
    },
    {
      key: "rogue",
      buttonText: "Pick a Rogue",
      description: "Rogues excel in AGI, granting them increased critical hit chances, moving speed, and hit accuracy, making them deadly for Mages. ",
      imageSrc: rogueImage
    },
    {
      key: "mage",
      buttonText: "Pick a Mage",
      description: "Mages wield powerful spells with INT progression, allowing them to deal devastating magical damage.",
      imageSrc: fireMageImage
    },
    {
      key: "custom",
      buttonText: "Custom class",
      description: "Advanced:\nCreate a unique build tailored to the needs of your custom strategy. Requires a custom Rust algorithm",
      imageSrc: customClassImage
    }
  ];

export const SelectClass = () => {
  return (
    <div className={clsx(styles.selectClass, styles.background)}>
      <PanelWithHeader
        headerTitle={'Select a character class'}
        className={styles.panel}
      >
        <Flex
          className={styles.content}
        >
          {characterClasses.map(({
            key,
            buttonText,
            description,
            imageSrc
          }) => {
            return <CharacterClass key={key} classKey={key} buttonText={buttonText} description={description} imageSrc={imageSrc} />;
          })}
        </Flex>
      </PanelWithHeader>
    </div>
  );
};

const CharacterClass = ({
  classKey,
  buttonText,
  description,
  imageSrc
}: {
  classKey: Specialization;
  buttonText: string;
  description: string;
  imageSrc: string;
}) => {
  const navigate = useNavigate();
  return (
    <>
      <Image className={styles.classImage} src={imageSrc} alt={buttonText} fit="contain" />
      <Text className={styles.classDescription}>{description}</Text>
      <TheButton mt="auto" onClick={() => navigate(routes.mintCharacterRoute(classKey))}>
        <Title fz={16}>{buttonText}</Title>
      </TheButton>
    </>
  );
};;
