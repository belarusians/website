import { Trans, useTranslation } from "next-i18next";
import * as React from "react";
import { FormEvent, HTMLAttributes } from "react";
import { fakeInput, subscribe, subscribeButton, subscribeInput, subscribeTitle, spinner, success } from "./subscribe.css";
import { ClientOnly } from "../client-only/client-only";
import { isEmailValid } from "../../lib/email";

const fakeInputId = "fake-input-id";

function updateWith(event: FormEvent<HTMLInputElement>): void {
  const fakeEl = document.getElementById(fakeInputId) as HTMLDivElement;
  fakeEl.innerHTML = event.currentTarget.value;

  const fakeStyles = window.getComputedStyle(fakeEl);
  event.currentTarget.style.width = fakeStyles.width;
}

export function Subscribe(props: HTMLAttributes<HTMLElement>): JSX.Element {
  const emailInputId = "email-input";

  const [t] = useTranslation();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isValid, setIsValid] = React.useState(true);
  const [isSuccess, setIsSuccess] = React.useState(false);

  function onInput(event: FormEvent<HTMLInputElement>): void {
    updateWith(event);

    setIsValid(isValidInput(event.currentTarget));
  }

  const inputRef = React.useRef<HTMLInputElement>(null);

  const shake = (): void => {
    inputRef.current?.classList.add("shake");
    setTimeout(() => {
      inputRef.current?.classList.remove("shake");
    }, 2000);
  };

  const submit = (event: React.MouseEvent) => {
    event.preventDefault();

    const emailInput = document.getElementById(emailInputId) as HTMLInputElement;
    if (!isValidInput(emailInput)) {
      shake();
      setIsValid(false);
      return;
    }

    setIsLoading(true);

    fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ email: emailInput.value })
    })
      .then((response) => {
        setIsLoading(false);

        if (!response.ok) {
          setIsValid(false);
          shake();
        } else {
          setIsSuccess(true);
        }
      });
  };

  return (
    <div className={props.className + " " + subscribe}>
      <h2 className={subscribeTitle}>
        <Trans>subscribe-title</Trans>
      </h2>
      {isSuccess ? (
        <div className={success}>
          <Trans>subscribed-text</Trans>
        </div>
      ) : (
        <ClientOnly>
          <input
            ref={inputRef}
            onInput={onInput}
            className={`${subscribeInput} ${isValid ? "valid" : "invalid"}`}
            id={emailInputId}
            name="email"
            type="email"
            placeholder={t("subscribe-input-placeholder")}
          />
        </ClientOnly>
      )}

      <div className={fakeInput} id={fakeInputId}></div>
      <button disabled={isLoading || isSuccess} className={subscribeButton + " " + (isLoading ? "loading" : "")} onClick={submit}>
        <span className={spinner + " " + (isLoading ? "show" : "hide")}></span>
        <Trans>subscribe-button</Trans>
      </button>
    </div>
  );
}

function isValidInput(input: HTMLInputElement): boolean {
  if (!input || !input.value) {
    return false;
  }

  return isEmailValid(input.value);
}
