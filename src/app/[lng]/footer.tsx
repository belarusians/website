import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faTwitter, faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";

export function Footer(props: { className?: string }): React.JSX.Element {
  return (
    <footer
      className={`flex items-center justify-between bg-red md:bg-white-shade text-white md:text-black p-3 md:pb-4 lg:pb-8 ${props.className}`}
    >
      <div className="flex gap-2 md:gap-4 lg:gap-6">
        <a rel="noreferrer" target={"_blank"} href="https://www.instagram.com/marabynl">
          <FontAwesomeIcon icon={faInstagram} className="text-2xl lg:text-3xl text-white md:text-red" />
        </a>
        <a rel="noreferrer" target={"_blank"} href="https://www.facebook.com/marabynl">
          <FontAwesomeIcon icon={faFacebook} className="text-2xl lg:text-3xl text-white md:text-red" />
        </a>
        <a rel="noreferrer" target={"_blank"} href="https://twitter.com/BelarusinNL">
          <FontAwesomeIcon icon={faTwitter} className="text-2xl lg:text-3xl text-white md:text-red" />
        </a>
        <a rel="noreferrer" target={"_blank"} href="https://github.com/belarusians">
          <FontAwesomeIcon icon={faGithub} className="text-2xl lg:text-3xl text-white md:text-red" />
        </a>
      </div>
      <p className="text-sm font-light tracking-wider">Belarusians NL 2023</p>
    </footer>
  );
}
