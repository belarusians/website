import { API } from "aws-amplify";
import * as React from "react";
import { Trans } from "react-i18next";

import { Header } from "./header/header";
import { Footer } from "./footer";
import { section } from "./layout.css";

export function Layout(): JSX.Element {
  const emailInputId = "email-input";
  const submit = (event: React.MouseEvent) => {
    event.preventDefault();

    const emailInput = document.getElementById(emailInputId) as HTMLInputElement;
    if (!isValidInput(emailInput)) {
      return;
    }

    API.post("subscribe", "/subscribe", {
      body: { email: emailInput.value },
    })
      .then((resp) => {
        console.log("subscribed", resp);
      })
      .catch((e) => {
        console.error(e.toJSON());
      });
  };

  return (
    <>
      <Header className={section} />
      <section className={section}>
        <Trans>subscribe</Trans>
        <input id={emailInputId} name="email" type="text" />
        <button onClick={submit}>
          <Trans>subscribe-button</Trans>
        </button>
      </section>
      <Footer className={section} />
    </>
  );
}

function isValidInput(input: HTMLInputElement): boolean {
  if (!input || !input.value) {
    return false;
  }

  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(input.value).toLowerCase());
}
