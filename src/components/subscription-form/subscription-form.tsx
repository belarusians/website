import { Trans, useTranslation } from "next-i18next";
import * as React from "react";
import { FormEvent } from "react";
import {
  subscriptionForm,
  subscribeButton,
  subscribeInput,
  spinner,
  success,
  subTitle
} from "./subscription-form.css";
import { ClientOnly } from "../client-only/client-only";
import { isEmailValid } from "../../lib/email";
import { bigText, normalText, sectionTitle } from "../styles.css";
import { col, row } from "../grid.css";

export function SubscriptionForm(): JSX.Element {
  const emailInputId = "email-input";

  const [t] = useTranslation();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isValid, setIsValid] = React.useState(true);
  const [isSuccess, setIsSuccess] = React.useState(false);

  function onInput(event: FormEvent<HTMLInputElement>): void {
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

    fetch("/api/subscribe", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email: emailInput.value }),
    }).then((response) => {
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
    <>
      <h1 className={sectionTitle}>
        <Trans>subscribe-title</Trans>
      </h1>
      <div className={col}>
        <div className={`${subTitle} ${bigText}`}>
          <Trans>subscribe-text</Trans>
        </div>
        <div className={`${subscriptionForm} ${row}`}>
        {isSuccess ? (
          <div className={success}>
            <Trans>subscribed-text</Trans>
          </div>
        ) : (
          <ClientOnly>
            <input
              ref={inputRef}
              onInput={onInput}
              className={`${subscribeInput} ${normalText} ${isValid ? "valid" : "invalid"}`}
              id={emailInputId}
              name="email"
              type="email"
              placeholder={t("subscribe-input-placeholder")}
            />
          </ClientOnly>
        )}

        <button disabled={isLoading || isSuccess} className={`${subscribeButton} ${isLoading ? "loading" : ""}`} onClick={submit}>
          <span className={spinner + " " + (isLoading ? "show" : "hide")}></span>
          <Trans>subscribe-button</Trans>
        </button>
      </div>
      </div>
    </>
  );
}

function isValidInput(input: HTMLInputElement): boolean {
  if (!input || !input.value) {
    return false;
  }

  return isEmailValid(input.value);
}
