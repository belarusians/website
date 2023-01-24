import { useTranslation } from "next-i18next";
import * as React from "react";
import { subscriptionForm, subscribeButton, subscribeInput, spinner, success, subTitle } from "./subscription-form.css";
import { ClientOnly } from "../client-only/client-only";
import { isEmailValid } from "../../lib/email";
import { centerSectionTitle } from "../common.styles.css";
import { col } from "../grid.css";
import { fadeInElementOnScroll } from "../../utils/animation.css";

export function SubscriptionForm(): JSX.Element {
  const emailInputId = "email-input";

  const { t } = useTranslation("main");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isValid, setIsValid] = React.useState(true);
  const [isSuccess, setIsSuccess] = React.useState(false);

  function onInput(event: React.FormEvent<HTMLInputElement>): void {
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
      <h2 className={centerSectionTitle}>{t("subscribe-title")}</h2>
      <div className={`${col} ${fadeInElementOnScroll}`}>
        <div className={subTitle}>{t("subscribe-text")}</div>
        <div className={subscriptionForm}>
          <ClientOnly>
            <div className={`${success} ${isSuccess ? "show" : "hide"}`}>{t("subscribed-text")}</div>
            <input
              ref={inputRef}
              onInput={onInput}
              className={`${subscribeInput} ${isValid ? "valid" : "invalid"} ${isSuccess ? "hide" : "show"}`}
              id={emailInputId}
              name="email"
              type="email"
              placeholder={t("subscribe-input-placeholder") || "subscribe"}
            />
          </ClientOnly>

          <button
            disabled={isLoading || isSuccess}
            className={`${subscribeButton} ${isLoading ? "loading" : ""}`}
            onClick={submit}
          >
            <span className={spinner + " " + (isLoading ? "show" : "hide")}></span>
            {t("subscribe-button")}
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
