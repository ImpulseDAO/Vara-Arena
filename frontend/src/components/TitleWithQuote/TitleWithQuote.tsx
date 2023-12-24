import { Anchor, Text } from "@mantine/core";

export const TitleWithQuote = ({
  children,
  quoteUrl
}: {
  children: React.ReactNode;
  quoteUrl?: string;
}) => {
  return (
    <div >
      <Text
        component="span"
        c="white"
        fw="600"
        fz={18}
      >
        {children}
      </Text>
      {quoteUrl && <Anchor ml={4} target="_blank" rel="noopener" href={quoteUrl}>
        [?]
      </Anchor>}
    </div>
  );
};
