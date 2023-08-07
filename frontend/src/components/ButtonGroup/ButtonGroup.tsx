import React, { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";
import "./styles.scss";
import { Button } from "../Button";

export type ButtonGroupProps = {
  disabled?: boolean;
  value?: string;
  buttonProps?: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;
  leftText?: string;
  firstButton?: string;
  secondButton: string | number;
  thirdButton?: string;
  onClickFirstButton?: VoidFunction;
  onClickSecondButton: VoidFunction;
  onClickThirdButton?: VoidFunction;
};

export const ButtonGroup: FC<ButtonGroupProps> = ({
  firstButton,
  secondButton,
  thirdButton,
  leftText,
  onClickFirstButton,
  onClickSecondButton,
  onClickThirdButton,
}) => {
  return (
    <div className={"pointButtonWrapper"}>
      <div className={"buttonText"}>{leftText}</div>
      {onClickFirstButton && (
        <Button className={"pointButton"} onClick={onClickFirstButton}>
          {firstButton}
        </Button>
      )}
      <Button className={"pointButton secondBtn"} onClick={onClickSecondButton}>
        {secondButton}
      </Button>
      {onClickThirdButton && (
        <Button className={"pointButton"} onClick={onClickThirdButton}>
          {thirdButton}
        </Button>
      )}
    </div>
  );
};
