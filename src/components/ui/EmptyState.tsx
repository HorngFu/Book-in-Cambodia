import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  text,
  children,
}: {
  icon?: ReactNode;
  title: ReactNode;
  text?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg bg-surface px-6 py-12 text-center">
      {icon ? (
        <span className="flex size-16 items-center justify-center rounded-full bg-primary-tint text-primary">
          {icon}
        </span>
      ) : null}
      <h2 className="text-2xl tracking-tighter">{title}</h2>
      {text ? <p className="max-w-md">{text}</p> : null}
      {children ? <div className="mt-2 flex flex-wrap justify-center gap-3">{children}</div> : null}
    </div>
  );
}
