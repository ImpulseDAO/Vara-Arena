import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  flex: 1;
  background: black;
  padding: 8px 14px;
  gap: 4px;
`;

const Header = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Title = styled.div`
  margin-left: auto;
  font-size: 20px;
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
const Content = styled.div`
  flex: 1;
`;
const Footer = styled.div`
  flex: 0;
`;

export const Styled = {
  Container,
  Header,
  Title,
  Close,
  Content,
  Footer,
};
