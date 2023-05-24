import styles from "./ScreenTitle.module.scss";

interface ScreenTitleProps {
  title: string;
  onClick?: () => void;
}

const ScreenTitle = ({ title, onClick }: ScreenTitleProps) => {
  return (
    <div className={styles.title} onClick={onClick}>
      {title}
    </div>
  );
};

export default ScreenTitle;
