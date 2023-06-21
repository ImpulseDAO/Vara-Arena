import { ChangeEventHandler, FC, InputHTMLAttributes, memo } from 'react';
import './styles.scss';

export type InputProps = {
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  value: string;
  placeholder?: string;
    className?: string;
};

export const Input: FC<InputProps> = memo(
  ({ inputProps, onChange, value, placeholder }) => (
    <div className='input_container'>
      <input
        {...inputProps}
        className='input'
        onChange={onChange}
        value={value}
        placeholder={placeholder}
      />
    </div>
  )
);
