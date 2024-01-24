import { ModalsProvider as MantineModalsProvider } from "@mantine/modals";

export const ModalsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <MantineModalsProvider modalProps={{
      styles: {
        content: {
          border: '2px solid white',
          backgroundColor: 'black',
        },
      },
    }}>
      {children}
    </MantineModalsProvider>
  );
};
