import { ZodError } from "zod";

export function querifyObject<T extends Record<string, unknown>>(obj: T): string {
  return Object.entries(obj).map(([key, value]) => `${key}=${value}`).join("&");
}

export class RequestError extends Error {
  constructor(message: string, public readonly status: number, zodError?: ZodError) {
    super(message);
    if (zodError) {
      this.cause = zodError.format();
    }
  }
}

export function cutQuery(url: string) {
  const index = url.indexOf("?");
  if (index === -1) {
    return url;
  }
  return url.substring(0, index);
}
