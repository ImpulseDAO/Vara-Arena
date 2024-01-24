import { ReactNode } from 'react';
import './styles.scss';
import { ControlProps, components } from 'react-select';

export type SelectControlProps = (props: ControlProps<any, false>) => ReactNode;

export const SelectControl: SelectControlProps = ({ children, ...props }) => {
  // @ts-ignore
  const { icon, selectedUser, onMenuOpen } = props.selectProps;
  return (
    <components.Control {...props} className='select_control'>
      {icon}
      {selectedUser?.label ? (
        <p className='select_value' onClick={() => onMenuOpen()}>
          {selectedUser?.label}
        </p>
      ) : (
        children
      )}
    </components.Control>
  );
};
