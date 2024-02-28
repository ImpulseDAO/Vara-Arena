import { Flex, Image, Text } from "@mantine/core";

import ElementFire from "assets/images/element-fire.png";
import ElementWater from "assets/images/element-water.png";
import ElementEarth from "assets/images/element-earth.png";

const magicShoolsMap = {
  fire: {
    imageSrc: ElementFire,
    label: 'Fire',
  },
  water: {
    imageSrc: ElementWater,
    label: 'Water',
  },
  earth: {
    imageSrc: ElementEarth,
    label: 'Earth',
  },
};

export const SchoolOfMagic = ({
  type,
  disabled,
  size = 60,
  className,
}: {
  size?: number;
  type?: MagicElement;
  disabled?: boolean;
  className?: string;
}) => {
  const dimmedStyle = disabled ? { filter: 'grayscale(20%) brightness(0.4)' } : {};


  return (
    <Flex
      className={className}
      gap="md"
      align="center"
      style={{ position: 'relative', ...disabled ? dimmedStyle : {} }}
    >
      {
        !type ? (
          <Text fw="600" c="white" >{"Not defined"}</Text>
        ) : (
          <>
            <Image height={size} width={size} src={magicShoolsMap[type].imageSrc} />
            <Text fw="600" c="white" >{magicShoolsMap[type].label}</Text>
          </>
        )
      }

    </Flex>
  );
};

