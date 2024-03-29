import { Flex, Radio, Stack } from "@mantine/core";
import { SchoolOfMagic } from "components/SchoolOfMagic";
import { TitleWithQuote } from "components/TitleWithQuote";

import { useState } from "react";

export const SchoolOfMagicChoice = ({
  onChange
}: {
  onChange: (element: MagicElement) => void;
}) => {
  const [elementChecked, setElementCheckedRaw] = useState<MagicElement | undefined>();
  const setElementChecked = (element: MagicElement) => {
    setElementCheckedRaw(element);
    onChange(element);
  };

  return (
    <Stack gap={'sm'}>
      <TitleWithQuote quoteUrl="https://impulse-dao.gitbook.io/impulse-dao/games-for-developers/arena" >
        Choose a School of Magic
      </TitleWithQuote>

      <Stack gap={'sm'}>
        {(['fire', 'water', 'earth'] as MagicElement[]).map((element, index) => {

          return (
            <SchoolOfMagicWithRadioButton
              key={index}
              isChecked={element === elementChecked}
              type={element}
              onClick={() => setElementChecked(element)}
              disabled={elementChecked != null && element !== elementChecked}
            />
          );
        })}
      </Stack>
    </Stack>
  );
};

const SchoolOfMagicWithRadioButton = ({
  type,
  isChecked,
  onClick,
  disabled,
}: {
  type: MagicElement;
  isChecked: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  return (
    <Flex gap="md" align="center" style={{ cursor: 'pointer' }} onClick={onClick}>
      <Radio checked={isChecked} color="white" size="xs" styles={{
        icon: {
          color: 'black'
        }
      }} />
      <SchoolOfMagic type={type} disabled={disabled} />
    </Flex >
  );
};
