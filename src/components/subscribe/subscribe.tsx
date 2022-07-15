import { section } from "../layout.css";
import { Trans } from "react-i18next";
import * as React from "react";
import { HTMLAttributes } from "react";
import { API } from "aws-amplify";
import { subscribe } from "./subscribe.css";

export function Subscribe(props: HTMLAttributes<HTMLElement>): JSX.Element {
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
    <section className={props.className + " " + subscribe}>
      <h2>
        <Trans>subscribe</Trans>
      </h2>
      <input id={emailInputId} name="email" type="text" />
      <button onClick={submit}>
        <Trans>subscribe-button</Trans>
      </button>
    </section>
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
