import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Two-tone heading: the accent part is purple, e.g. "Find the category <for you>". */
export function TwoTone({ start, accent }: { start: ReactNode; accent?: ReactNode }) {
  return (
    <>
      {start}
      {accent ? (
        <>
          {" "}
          <span className="text-primary">{accent}</span>
        </>
      ) : null}
    </>
  );
}

export const sectionTitle =
  "text-[30px] leading-[1.1] tracking-tightest md:text-5xl md:leading-[1.1]";

export function SectionHeader({
  id,
  start,
  accent,
  lead,
  action,
  centered = false,
  className,
}: {
  id?: string;
  start: ReactNode;
  accent?: ReactNode;
  lead?: ReactNode;
  action?: ReactNode;
  centered?: boolean;
  className?: string;
}) {
  if (centered) {
    return (
      <div className={cn("mb-10 text-center", className)}>
        <h2 id={id} className={sectionTitle}>
          <TwoTone start={start} accent={accent} />
        </h2>
        {lead ? <p className="mx-auto mt-3 max-w-xl text-lg">{lead}</p> : null}
      </div>
    );
  }
  return (
    <div className={cn("mb-10 flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="max-w-2xl">
        <h2 id={id} className={sectionTitle}>
          <TwoTone start={start} accent={accent} />
        </h2>
        {lead ? <p className="mt-3 text-lg">{lead}</p> : null}
      </div>
      {action}
    </div>
  );
}
