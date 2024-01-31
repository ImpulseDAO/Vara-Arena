
import styles from './Header.module.css';

export const Header = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className={styles.header}>
      {children}
    </div>
  );
};
