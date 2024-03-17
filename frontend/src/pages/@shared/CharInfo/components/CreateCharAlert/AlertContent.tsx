import { Styled } from "./styles";

export const AlertContent = () => {
  return (
    <Styled.Content>
      <Styled.Description>
        You can either use a new wallet or create a new character.
      </Styled.Description>
      <Styled.Attention>
        Remember: <br /> <span>1 Discord = 1 Wallet = 1 Voucher</span>
      </Styled.Attention>
    </Styled.Content>
  );
};
