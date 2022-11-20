import { useTranslation } from "next-i18next";
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
import { centerSectionTitle } from "../styles.css";
import { col } from "../grid.css";

export function SubscriptionForm(): JSX.Element {
  const emailInputId = "email-input";

  const { t } = useTranslation('main');
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
      <h1 className={centerSectionTitle}>
          {t('subscribe-title')}
      </h1>
      <div className={col}>
        <div className={subTitle}>
          {t('subscribe-text')}
        </div>
        <div className={subscriptionForm}>
        {isSuccess ? (
          <div className={success}>
          {t('subscribed-text')}
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
              placeholder={t("subscribe-input-placeholder") || "subscribe"}
            />
          </ClientOnly>
        )}

        <button disabled={isLoading || isSuccess} className={`${subscribeButton} ${isLoading ? "loading" : ""}`} onClick={submit}>
          <span className={spinner + " " + (isLoading ? "show" : "hide")}></span>
          {t('subscribe-button')}
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
