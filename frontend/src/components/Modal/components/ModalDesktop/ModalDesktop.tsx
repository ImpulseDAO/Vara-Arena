import { ReactNode, RefObject, forwardRef } from "react";
import { Styled } from "./styles";
import { sizeType } from "../../constants";
import { CloseButton } from "@mantine/core";

type ModalDesktopProps = {
  size: keyof typeof sizeType;
  title?: string;
  onClose?: VoidFunction;
  footerSlot?: ReactNode;
  contentSlot?: ReactNode;
};

export const ModalDesktop = forwardRef(
  (
    { size, onClose, title, contentSlot, footerSlot }: ModalDesktopProps,
    ref: RefObject<HTMLDivElement>
  ) => {
    return (
      <Styled.Container ref={ref} size={size}>
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
  }
);
