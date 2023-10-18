"use client";

import { ChangeEvent, MouseEvent, useState } from "react";

import { Button } from "../../../components/button/button";
import { Donation, parseDonation } from "../../../contract/donate";
import { querifyObject } from "../../../lib/utils";
import { PropsWithClass } from "../../types";

function Spinner({ className }: PropsWithClass) {
  return (
    <div className={className}>
    <span className={`
    before:m-auto before:origin-center before:absolute before:inset-x-0 before:inset-y-0 before:box-border before:animate-rotate-back-fast before:w-[80%] before:h-[80%] before:rounded-full before:border-2 before:border-r-transparent before:border-t-transparent before:border-b-transparent before:border-l-red
    after:m-auto after:origin-center after:absolute after:inset-x-0 after:inset-y-0 after:box-border after:animate-rotate-back after:w-[60%] after:h-[60%] after:rounded-full after:border-2 after:border-r-transparent after:border-t-transparent after:border-b-white after:border-l-white
    relative box-border animate-rotate-slow inline-block w-[100%] h-[100%] rounded-full border-2 border-t-white border-b-transparent border-l-transparent border-r-white
     `}></span>
    </div>
  );
}

interface DonateButtonsProps {
  recurringLabel: string;
  donateBtnLabel: string;
  donateBtnErrLabel: string;
}

export function DonateButtons(props: DonateButtonsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isShaking, doShake] = useState(false);

  const defaultPrice = 5;
  const [price, setPrice] = useState(defaultPrice);
  const [isRecurring, setIsRecurring] = useState(false);
  const [customPrice, setCustomPrice] = useState<number | null>(null);

  const prices = [
    3, 5, 10, 20, 50,
  ];

  function handleRecurring(event: ChangeEvent<HTMLInputElement>) {
    setIsRecurring(event.target.checked);
    setIsValid(true);
  }

  function handlePriceClick(p: number) {
    setCustomPrice(null);
    setPrice(p);
    setIsValid(true);
  }

  function handleCustomPriceClick(event: MouseEvent<HTMLInputElement>) {
    setPrice(0);
    setCustomPrice(0);
    setIsValid(true);

    // TODO: something is wrong with event.target type
    if ((event.target as HTMLInputElement).value) {
      (event.target as HTMLInputElement).setSelectionRange((event.target as HTMLInputElement).value.length - 1, (event.target as HTMLInputElement).value.length - 1);
    }
  }

  function handleCustomPriceInput(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.value.indexOf("€") !== -1) {
      event.target.value = event.target.value
        .replace("€", "")
        .replace(/[^0-9]/g, "");
    }
    const clearValue = event.target.value;
    setCustomPrice(parseInt(clearValue));

    event.target.value = event.target.value + "€";
    event.target.setSelectionRange(event.target.value.length - 1, event.target.value.length - 1);
  }

  async function sendDonation() {
    setIsValid(true);
    setIsLoading(true);
    try {
      const donation = parseDonation({
        amount: customPrice === null ? price : customPrice,
        recurring: isRecurring,
      });

      const response = await fetch(`/api/donate/link?${querifyObject<Donation>(donation)}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      });

      if (!response.ok) {
        setIsLoading(false);
        setIsValid(false);
        shake();
        return;
      }

      const body = await response.json();
      window.open(body.payment_link, "_self");

      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      setIsValid(false);
      shake();
      return;
    }
  }

  const shake = (): void => {
    doShake(true);
    setTimeout(() => {
      doShake(false);
    }, 1000);
  };

  return (
    <>
      {prices.map((p, i) =>
        <Button disabled={isLoading} className={`${p === price ? "bg-red text-white" : "bg-white"}`} size="large"
                label={`${p}€`}
                key={i} click={() => handlePriceClick(p)} />,
      )}
      <input
        className={`${customPrice !== null ? "bg-red text-white placeholder-white" : "bg-white placeholder-black"} text-center transition-all shadow-lg ${isLoading ? "" : "hover:shadow-xl active:shadow-2xl"} rounded-md appearance-none border-transparent border-none p-2 md:p-3 lg:p-4 text-lg`}
        min="1"
        max="1000"
        placeholder="...€"
        disabled={isLoading}
        onClick={handleCustomPriceClick}
        onInput={handleCustomPriceInput}
      />
      <div className="col-span-2">
        <input disabled={isLoading} type="checkbox" id="recurring" checked={isRecurring}
               className="text-red transition-all shadow-lg hover:shadow-xl active:shadow-2xl rounded-md appearance-none border-none p-4 cursor-pointer"
               onChange={handleRecurring} />
        <label htmlFor="recurring" className="ml-3 cursor-pointer">{props.recurringLabel}</label>
      </div>
      <Button size="large" type="submit"
              className={`transition-all col-span-2 flex justify-center ${isShaking ? "animate-shake" : ""} ${isLoading ? "bg-red" : "bg-white"} ${isValid ? "" : "ring-red ring-2"}`}
              disabled={isLoading}
              click={sendDonation}>
        {isLoading
          ? <Spinner className="w-7 h-7" />
          : isValid ? props.donateBtnLabel
            : props.donateBtnErrLabel}
      </Button>
    </>
  );
}