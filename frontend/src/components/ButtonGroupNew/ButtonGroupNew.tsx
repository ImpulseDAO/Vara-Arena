import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";
import "./styles.scss";
import { Button, Flex } from "@mantine/core";

export type ButtonGroupNewProps = {
  disabled?: boolean;
  buttonProps?: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;
  leftText?: string;
  firstButton?: string;
  value: string | number;
  secondButton?: string;
  onClickFirstButton?: VoidFunction;
  onClickSecondButton?: VoidFunction;
  //
  isFirstDisabled?: boolean;
  isSecondDisabled?: boolean;
};

export const ButtonGroupNew: FC<ButtonGroupNewProps> = ({
  firstButton,
  value,
  secondButton,
  leftText,
  onClickFirstButton,
  onClickSecondButton,
  isFirstDisabled = false,
  isSecondDisabled = false,
}) => {
  return (
    <div className={"pointButtonWrapper"}>
      <div className={"buttonText"}>{leftText}</div>
      <Button.Group>
        {onClickFirstButton && (
          <Button
            className={"pointButton"}
            onClick={onClickFirstButton}
            disabled={isFirstDisabled}
          >
            {firstButton}
          </Button>
        )}
        <Flex
          align={'center'}
          justify={'center'}
          style={{ cursor: 'default' }}
          className={"pointButton secondBtn"}
        >
          {value}
        </Flex>
        {onClickSecondButton && (
          <Button
            className={"pointButton"}
            onClick={onClickSecondButton}
            disabled={isSecondDisabled}
          >
            {secondButton}
          </Button>
        )}
      </Button.Group>
    </div>
  );
};
