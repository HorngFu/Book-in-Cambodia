import type { ReactNode } from "react";

/** Full-bleed purple call-to-action panel. */
export function CtaBand({
  title,
  text,
  children,
}: {
  title: ReactNode;
  text?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="px-2 md:px-4">
      <div className="mx-auto flex max-w-[1408px] flex-col items-center gap-4 rounded-lg bg-primary px-5 py-12 text-center text-white md:px-6 md:py-22">
        <h2 className="max-w-3xl text-[30px] leading-[1.1] tracking-tightest text-white md:text-5xl">
          {title}
        </h2>
        {text ? <p className="max-w-xl text-primary-tint md:text-lg">{text}</p> : null}
        {children ? (
          <div className="mt-3 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
