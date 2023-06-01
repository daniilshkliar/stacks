import styles from "./NoData.module.scss";
import FaviconMini from "../../assets/icons/favicon-mini.svg";

interface NoDataProps {
  text?: string;
}

const NoData = ({ text }: NoDataProps) => {
  return (
    <div className={styles.container}>
      <img
        className={styles.faviconMini}
        src={FaviconMini}
        alt="favicon"
        draggable="false"
      />

      <div className={styles.text}>{text}</div>
    </div>
  );
};

export default NoData;
