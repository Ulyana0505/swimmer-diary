import { Link, useMatches } from "react-router-dom";
import router from "../router.tsx";
import styles from "./header.module.css";
import { getHandle } from "../utils.ts";
import { useEffect } from "react";
import mainPic from "../assets/main.png";

export default function Header() {
  const ids = useMatches();
  const currentTitle = getHandle(ids[ids.length - 1]).title;
  const rootTitle = getHandle(router.routes[0].children![0]).title;

  useEffect(() => {
    document.title = currentTitle === rootTitle ? currentTitle : `${currentTitle} - ${rootTitle}`;
  }, [currentTitle, rootTitle]);

  return (
    <nav className={styles.nav}>
      <MainLink />
      <PagesLinks />
    </nav>
  );
}

function MainLink() {
  const route = router.routes[0].children![0];
  return (
    <div className={styles.main}>
      <div>
        <Link to={route.path!} className={styles.main}>
          {getHandle(route).title}
        </Link>
      </div>
      <div>
        <Link to={route.path!} className={styles.main}>
          <img src={mainPic} srcSet={mainPic + " 2x"} width={120} height={120} alt="" />
        </Link>
      </div>
    </div>
  );
}

function PagesLinks() {
  const ids = useMatches();
  const currentId = ids[1].id;
  return (
    <div className={styles.pages}>
      <ul>
        {router.routes[0].children!.slice(1).map((route) => (
          <li key={route.path} className={route.id === currentId ? styles.current : void 0}>
            <Link to={route.path!}>{getHandle(route).linkText}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
