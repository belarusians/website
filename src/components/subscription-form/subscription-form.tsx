import { useTranslation } from "next-i18next";
import * as React from "react";
import { ClientOnly } from "../client-only/client-only";
import { isEmailValid } from "../../lib/email";
import { Button } from "../button/button";

export function SubscriptionForm(): React.JSX.Element {
  const emailInputId = "email-input";

  const { t } = useTranslation("main");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isValid, setIsValid] = React.useState(true);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isShaking, doShake] = React.useState(false);

  function onInput(event: React.FormEvent<HTMLInputElement>): void {
    setIsValid(isValidInput(event.currentTarget));
  }

  const inputRef = React.useRef<HTMLInputElement>(null);

  const shake = (): void => {
    doShake(true);
    setTimeout(() => {
      doShake(false);
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
      <h2 className="text-xl text-center font-medium md:text-3xl mb-2">{t("subscribe-title")}</h2>
      <div className="flex flex-col gap-4 items-center">
        <div className="text-center md:text-xl lg:w-96 mb-2">{t("subscribe-text")}</div>
        <div className="flex flex-row gap-3 justify-center md:gap-4 w-full">
          <ClientOnly>
            {isSuccess ? (
              <span className="flex flex-col justify-center">{t("subscribed-text")}</span>
            ) : (
              <input
                ref={inputRef}
                onInput={onInput}
                className={`${isShaking ? "animate-shake" : ""} ${
                  isValid ? "border border-white" : "border border-red"
                } appearance-none outline-none transition-all p-2 lg:p-3 bg-white basis-full md:basis-1/3 rounded-md shadow-lg hover:shadow-xl active:shadow-2xl`}
                id={emailInputId}
                name="email"
                type="email"
                placeholder={t("subscribe-input-placeholder") || "subscribe"}
              />
            )}
          </ClientOnly>

          <Button click={submit} isLoading={isLoading} label={t("subscribe-button")}></Button>
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
