import { FC, ReactNode, memo } from 'react';
import './styles.scss';
import UserIcon from '../../assets/svg/user.svg';
export type CustomOptionProps = { children: ReactNode; };

export const CustomOption: FC<CustomOptionProps> = memo(
  //@ts-ignore
  ({ children, data, selectProps }) => {
    const { onClick } = selectProps;
    return (
      <div
        className='custom_option'
        onClick={() => {
          onClick(data);
          selectProps.onMenuClose();
        }}
      >
        <img src={UserIcon} alt="user icon" />
        <p>{children}</p>
      </div>
    );
  }
);
