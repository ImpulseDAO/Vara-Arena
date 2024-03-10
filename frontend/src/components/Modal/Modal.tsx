import { deviceType, useDevice } from "shared/theme";
import { ModalMobile } from "./components/ModalMobile/ModalMobile";
import { ModalDesktop } from "./components/ModalDesktop/ModalDesktop";
import { Styled } from "./styles";
import { createPortal } from "react-dom";
import { sizeType } from "./constants";
import { FC, ReactNode, useCallback } from "react";
import { useClickOutside } from "@mantine/hooks";

export type ModalProps = {
  size: keyof typeof sizeType;
  onClose?: VoidFunction;
  title?: string;
  showCloseButton?: boolean;
  footerSlot?: ReactNode;
  contentSlot?: ReactNode;
};

export const Modal: FC<ModalProps> = ({
  onClose,
  showCloseButton,
  ...props
}) => {
  const device = useDevice();

  const Modal = device === deviceType.mobile ? ModalMobile : ModalDesktop;

  const onCloseWrapper = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const modalRef = useClickOutside(onCloseWrapper);

  const Component = (
    <Styled.Container>
      <Modal
        {...props}
        ref={modalRef}
        onClose={showCloseButton ? onCloseWrapper : undefined}
      />
    </Styled.Container>
  );

  return createPortal(Component, document.body);
};
