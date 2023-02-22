import * as React from "react";
import { footer, disclaimer, icon, link } from "./footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faTwitter, faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";

export function Footer(props: { className?: string }): JSX.Element {
  return (
    <div className={props.className + " " + footer}>
      <a className={link} rel="noreferrer" target={"_blank"} href="https://www.instagram.com/marabynl">
        <FontAwesomeIcon icon={faInstagram} className={icon} />
      </a>
      <a className={link} rel="noreferrer" target={"_blank"} href="https://www.facebook.com/marabynl">
        <FontAwesomeIcon icon={faFacebook} className={icon} />
      </a>
      <a className={link} rel="noreferrer" target={"_blank"} href="https://twitter.com/BelarusinNL">
        <FontAwesomeIcon icon={faTwitter} className={icon} />
      </a>
      <a className={link} rel="noreferrer" target={"_blank"} href="https://github.com/belarusians">
        <FontAwesomeIcon icon={faGithub} className={icon} />
      </a>
      <p className={disclaimer}>Belarusians NL 2023</p>
    </div>
  );
}
