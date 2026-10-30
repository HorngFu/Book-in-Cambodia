"use client";

import { Flag } from "lucide-react";
import { usePathname } from "next/navigation";
import { site } from "@/config/site";
import { forms } from "@/lib/contribute";

/** "Report a problem with this page", pre-filled with the current page's address. */
export function ReportLink({ label }: { label: string }) {
  const pathname = usePathname();
  return (
    <a
      href={forms.reportProblem(`${site.url}${pathname}`)}
      className="inline-flex items-center gap-2 text-body no-underline hover:text-primary"
    >
      <Flag size={16} aria-hidden="true" />
      {label}
    </a>
  );
}
