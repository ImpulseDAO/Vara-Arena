import { deviceType } from "shared/theme";
import styled from "styled-components";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  /* font-size: 14px; */
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;

const Description = styled.p`
  margin-bottom: 20px;
`;

const Attention = styled.p`
  margin-top: 20px;
  font-weight: bold;
  & > span {
    font-weight: normal;
    color: #e8ca64;
  }
`;

const ButtonGroup = styled.div<{ device: string }>`
  display: flex;
  gap: 4px;
  width: 100%;
  justify-content: space-between;
  flex-direction: ${({ device }) =>
    device === deviceType.mobile ? "column" : "row"};
`;

const Name = styled.span`
  color: white;
  font-weight: bold;
`;

export const Styled = {
  Content,
  Description,
  Attention,
  Footer,
  ButtonGroup,
  Name,
};
