import { ChangeEventHandler, FC, InputHTMLAttributes, memo } from "react";
import "./styles.scss";

export type InputProps = {
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  value: string;
  placeholder?: string;
  className?: string;
  name?: string;
};

export const Input: FC<InputProps> = memo(
  ({ inputProps, onChange, value, placeholder, name }) => (
    <div className="input_container">
      <input
        {...inputProps}
        className="input"
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        name={name}
      />
    </div>
  )
);
