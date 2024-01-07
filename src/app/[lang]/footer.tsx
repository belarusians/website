import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTelegram, faGithub, faTwitter, faFacebook, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

export function Footer(props: { className?: string }): React.JSX.Element {
  const year = new Date().getFullYear();
  return (
    <footer
      className={`flex items-center justify-between bg-red md:bg-white-shade text-white md:text-black p-3 md:pb-4 lg:pb-8 ${props.className}`}
    >
      <div className="flex gap-2 md:gap-4 lg:gap-6">
        <a rel="noreferrer" target={'_blank'} href="https://www.instagram.com/marabynl">
          <FontAwesomeIcon icon={faInstagram} className="text-2xl lg:text-3xl text-white md:text-red" />
        </a>
        <a rel="noreferrer" target={'_blank'} href="https://www.facebook.com/marabynl">
          <FontAwesomeIcon icon={faFacebook} className="text-2xl lg:text-3xl text-white md:text-red" />
        </a>
        <a rel="noreferrer" target={'_blank'} href="https://twitter.com/BelarusinNL">
          <FontAwesomeIcon icon={faTwitter} className="text-2xl lg:text-3xl text-white md:text-red" />
        </a>
        <a rel="noreferrer" target={'_blank'} href="https://www.linkedin.com/company/marabynl">
          <FontAwesomeIcon icon={faLinkedin} className="text-2xl lg:text-3xl text-white md:text-red" />
        </a>
        <a rel="noreferrer" target={'_blank'} href="https://github.com/belarusians">
          <FontAwesomeIcon icon={faGithub} className="text-2xl lg:text-3xl text-white md:text-red" />
        </a>
        <a rel="noreferrer" target={'_blank'} href="https://t.me/+I0pG4qwEv2E4Mjhi">
          <FontAwesomeIcon icon={faTelegram} className="text-2xl lg:text-3xl text-white md:text-red" />
        </a>
        <iframe className="hidden md:block" src="https://status.belarusians.nl/badge" width="250" height="30" frameBorder="0" scrolling="no"></iframe>
      </div>
      <p className="text-sm font-light tracking-wider">Belarusians NL {year}</p>
    </footer>
  );
}
