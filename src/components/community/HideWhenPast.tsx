"use client";

import { useSyncExternalStore, type ReactNode } from "react";

const subscribe = () => () => {};

/**
 * Pages are built once a day, so an event can end before the next build.
 * This hides it in the browser as soon as it is over. The server render (and
 * any reader without JavaScript) still shows it until the next daily build.
 */
export function HideWhenPast({ endsAt, children }: { endsAt: string; children: ReactNode }) {
  const past = useSyncExternalStore(
    subscribe,
    () => Date.now() > Date.parse(endsAt),
    () => false,
  );
  return past ? null : children;
}
