import { Trans, useTranslation } from "react-i18next";
import * as React from "react";
import { FormEvent, HTMLAttributes } from "react";
import { API } from "aws-amplify";
import { fakeInput, subscribe, subscribeButton, subscribeInput, subscribeTitle, spinner, success } from "./subscribe.css";

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
  }

  const submit = (event: React.MouseEvent) => {
    event.preventDefault();

    const emailInput = document.getElementById(emailInputId) as HTMLInputElement;
    if (!isValidInput(emailInput)) {
      shake();
      setIsValid(false);
      return;
    }

    setIsLoading(true);
    API.post("prodapi", "/subscribe", {
      body: { email: emailInput.value },
    })
      .then(() => {
        setIsLoading(false);
        setIsSuccess(true);
      })
      .catch(() => {
        setIsLoading(false);
        setIsValid(false);
        shake();
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
        <input
          ref={inputRef}
          onInput={onInput}
          className={`${subscribeInput} ${(isValid ? "valid" : "invalid")}`}
          id={emailInputId}
          name="email"
          type="email"
          placeholder={t("subscribe-input-placeholder")}
        />
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

  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(input.value).toLowerCase());
}
