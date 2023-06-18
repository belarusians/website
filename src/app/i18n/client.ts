"use client";

import i18next from "i18next";
import { initReactI18next, useTranslation as useTranslationOrg, UseTranslationOptions } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { defaultNS, getOptions } from "./settings";

// on client side the normal singleton is ok
i18next
  .use(initReactI18next)
  .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
  .init({
    ...getOptions(),
    lng: undefined, // let detect the language on client side
    detection: {
      order: ["path", "htmlTag", "cookie", "navigator"],
    },
  });

export function useTranslation(lng: string, ns = defaultNS, options: UseTranslationOptions = {}) {
  if (i18next.resolvedLanguage !== lng) {
    i18next.changeLanguage(lng);
  }
  return useTranslationOrg(ns, options);
}
