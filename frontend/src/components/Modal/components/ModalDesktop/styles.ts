import { sizeType, sizeValue } from "components/Modal/constants";
import styled, { css } from "styled-components";

const Container = styled.div<{ size: keyof typeof sizeType }>`
  display: flex;
  flex-direction: column;
  background: black;
  border: 1px solid white;
  border-radius: 12px;
  padding: 8px 14px;
  gap: 4px;

  ${({ size }) => {
    const value = `${sizeValue[size]}px`;

    return css`
      height: ${value};
      width: ${value};
    `;
  }};
`;

const Header = styled.div`
  height: 36px;
  display: flex;
  width: 100%;
  margin-bottom: 20px;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
`;

const Close = styled.div`
  margin-left: auto;
  cursor: pointer;

  svg {
    &:hover {
      stroke: white;
    }
  }
`;

const Title = styled.div`
  margin-left: auto;
  font-size: 20px;
`;

const Footer = styled.div`
  display: flex;
  flex: 0;
  min-height: 72px;
  height: 58px;
  width: 100%;
`;

export const Styled = {
  Container,
  Header,
  Content,
  Close,
  Title,
  Footer,
};
