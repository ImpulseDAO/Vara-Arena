import { Title, TitleProps } from "@mantine/core";

export const TitleText = ({ children, ...titleProps }: TitleProps) => <Title order={2} c={'white'} {...titleProps} >{children}</Title>;
