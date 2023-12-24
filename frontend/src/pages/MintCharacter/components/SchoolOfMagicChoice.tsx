import { Flex, Image, Radio, Stack, Text } from "@mantine/core";
import { TitleWithQuote } from "components/TitleWithQuote";

import ElementFire from "assets/images/element-fire.png";
import ElementWater from "assets/images/element-water.png";
import ElementEarth from "assets/images/element-earth.png";
import { useState } from "react";

export const SchoolOfMagicChoice = ({
  onChange
}: {
  onChange: (element: MagicElement) => void;
}) => {
  const [elementChecked, setElementChecked] = useState<MagicElement | undefined>();

  return (
    <Stack spacing={'sm'}>
      <TitleWithQuote quoteUrl="https://impulse-dao.gitbook.io/impulse-dao/games-for-developers/arena" >
        Choose a School of Magic
      </TitleWithQuote>

      <Stack spacing={'sm'}>
        {([
          { imageSrc: ElementFire, label: 'Fire', value: 'fire' as MagicElement },
          { imageSrc: ElementWater, label: 'Water', value: 'water' as MagicElement },
          { imageSrc: ElementEarth, label: 'Earth', value: 'earth' as MagicElement },
        ]).map(({ imageSrc, label, value }, index) => {

          return (
            <SchoolOfMagic
              key={index}
              isChecked={value === elementChecked}
              imageSrc={imageSrc}
              label={label}
              onClick={() => setElementChecked(value)}
              disabled={elementChecked != null && value !== elementChecked}
            />
          );
        })}
      </Stack>
    </Stack>
  );
};

const SchoolOfMagic = ({
  isChecked,
  imageSrc,
  label,
  onClick,
  disabled,
}: {
  isChecked: boolean;
  imageSrc: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const dimmedStyle = disabled ? { filter: 'grayscale(20%) brightness(0.4)' } : {};
  return (
    <Flex {...flexProps} sx={{ cursor: 'pointer' }} onClick={onClick}>
      <Radio checked={isChecked} color="white" size="xs" styles={{
        icon: {
          color: 'black'
        }
      }} />
      <Flex {...flexProps} style={{ position: 'relative', ...disabled ? dimmedStyle : {} }} >
        <Image height={60} width={60} src={imageSrc} />
        <Text fw="600" c="white" >{label}</Text>
      </Flex>
    </Flex >
  );
};

const flexProps = {
  gap: 'md',
  align: 'center'
};
