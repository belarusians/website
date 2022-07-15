import { section } from "../layout.css";
import { Trans } from "react-i18next";
import * as React from "react";
import { FormEvent, HTMLAttributes } from "react";
import { API } from "aws-amplify";
import { fakeInput, subscribe, subscribeButton, subscribeInput, subscribeTitle, spinner } from "./subscribe.css";

const fakeInputId = "fake-input-id";

function updateWith(event: FormEvent<HTMLInputElement>): void {
  const fakeEl = document.getElementById(fakeInputId) as HTMLDivElement;
  fakeEl.innerHTML = event.currentTarget.value;

  const fakeStyles = window.getComputedStyle(fakeEl);
  event.currentTarget.style.width = fakeStyles.width;
}

export function Subscribe(props: HTMLAttributes<HTMLElement>): JSX.Element {
  const emailInputId = "email-input";

  const [isLoading, setIsLoading] = React.useState(false);
  const [isValid, setIsValid] = React.useState(true);

  function onInput(event: FormEvent<HTMLInputElement>): void {
    updateWith(event);

    setIsValid(isValidInput(event.currentTarget));
  }

  const submit = (event: React.MouseEvent) => {
    event.preventDefault();

    const emailInput = document.getElementById(emailInputId) as HTMLInputElement;
    if (!isValidInput(emailInput)) {
      setIsValid(false);
      return;
    }

    setIsLoading(true);
    API.post("subscribe", "/subscribe", {
      body: { email: emailInput.value },
    })
      .then((resp) => {
        setIsLoading(false);
        console.log("subscribed", resp);
      })
      .catch((e) => {
        setIsLoading(false);
        console.error(e.toJSON());
      });
  };

  return (
    <section className={props.className + " " + subscribe}>
      <h2 className={subscribeTitle}>
        <Trans>subscribe-title</Trans>
      </h2>
      <input onInput={onInput} className={subscribeInput + " " + (isValid ? "valid" : "invalid")} id={emailInputId} name="email" type="text" />
      <div className={fakeInput} id={fakeInputId}></div>
      <button disabled={isLoading || !isValid} className={subscribeButton + " " + (isLoading ? "loading" : "")} onClick={submit}>
        <div className={spinner + " " + (isLoading ? "show" : "hide")}></div>
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
