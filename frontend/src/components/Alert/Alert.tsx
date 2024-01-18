import { FC, memo } from "react";
import { Button, ButtonProps } from "components/Button";
import "./styles.scss";

type AlertProps = {
  title: string;
  subTitle?: string;
  buttonsSlot: Array<ButtonProps>;
};

export const Alert: FC<AlertProps> = memo(
  ({ buttonsSlot, title, subTitle }) => {
    return (
      <div className="alert">
        <div className="alert_window">
          <p className="alert_title">{title}</p>
          {subTitle && <p className="alert_subTitle">{subTitle}</p>}
          <div className="alert_buttons">
            {buttonsSlot.map(({ children, ...restButtonProps }, i) => (
              <>
                {i % 2 ? <div className="alert_divider" key={i}></div> : null}
                <Button {...restButtonProps}>{children}</Button>
              </>
            ))}
          </div>
        </div>
      </div>
    );
  }
);
