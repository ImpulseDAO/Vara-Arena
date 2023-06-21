import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FC,
  ReactNode,
} from 'react';
import Icon from '@mui/material/Icon';
import './styles.scss';
import clsx from 'clsx';

export type ButtonProps = {
  onClick: VoidFunction;
  children: ReactNode;
  disabled?: boolean;
  value?: string;
  buttonProps?: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;
  className?: string;
};

export const Button: FC<ButtonProps> = ({
  onClick,
  children,
  disabled,
  buttonProps,
  className,
}) => {
  const classes = clsx('button', className, { disabled });
  return (
    <button
      {...buttonProps}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
