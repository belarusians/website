import * as React from "react";
import { footer, disclaimer, icon, link } from "./footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";

export function Footer(): JSX.Element {
  return (
    <div className={footer}>
      <a className={link} target={'_blank'} href="https://www.instagram.com/marabynl">
        <FontAwesomeIcon icon={faInstagram} className={icon} />
      </a>
      <a className={link} target={'_blank'} href="https://www.facebook.com/marabynl">
        <FontAwesomeIcon icon={faFacebook} className={icon} />
      </a>
      <a className={link} target={'_blank'} href="https://github.com/belarusians/website">
        <FontAwesomeIcon icon={faGithub} className={icon} />
      </a>
      <p className={disclaimer}>Belarusians NL 2022</p>
    </div>
  );
}
