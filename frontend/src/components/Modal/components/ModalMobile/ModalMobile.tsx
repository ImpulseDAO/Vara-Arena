import { FC, ReactNode } from "react";
import { Styled } from "./styles";
import { CloseButton } from "@mantine/core";

export type ModalMobileProps = {
  title?: string;
  onClose?: VoidFunction;
  footerSlot?: ReactNode;
  contentSlot?: ReactNode;
};

export const ModalMobile: FC<ModalMobileProps> = ({
  contentSlot,
  footerSlot,
  title,
  onClose,
}) => {
  return (
    <Styled.Container>
      <Styled.Header>
        <Styled.Title>{title}</Styled.Title>
        <Styled.Close>
          {onClose && (
            <CloseButton onClick={onClose} size="lg" variant="transparent" />
          )}
        </Styled.Close>
      </Styled.Header>
      <Styled.Content>{contentSlot}</Styled.Content>
      <Styled.Footer>{footerSlot}</Styled.Footer>
    </Styled.Container>
  );
};
