import styles from "app/dashboard.module.css";
export default function Home() {
  const cur_year = new Date().getFullYear();

  return (
    <div className={styles.container}>
      Welcome to Dodge Beer {cur_year} Tournament !
    </div>
  );
}
