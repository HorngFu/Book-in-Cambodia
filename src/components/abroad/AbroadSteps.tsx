import { SectionHeader } from "@/components/ui/Heading";
import type { Dictionary } from "@/i18n/dictionaries";

export function AbroadSteps({ dict }: { dict: Dictionary }) {
  const steps = [
    [dict.abroad.step1Title, dict.abroad.step1Text],
    [dict.abroad.step2Title, dict.abroad.step2Text],
    [dict.abroad.step3Title, dict.abroad.step3Text],
  ];
  return (
    <section aria-labelledby="abroad-how">
      <SectionHeader
        id="abroad-how"
        centered
        start={dict.abroad.howStart}
        accent={dict.abroad.howAccent}
      />
      <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-6">
        {steps.map(([title, text], i) => (
          <li key={title} className="flex flex-col gap-2.5 rounded-lg border border-line p-8">
            <span className="flex size-14 items-center justify-center rounded-full bg-primary-tint text-xl font-bold text-primary">
              {i + 1}
            </span>
            <strong className="mt-1.5 text-[22px] font-semibold tracking-tighter text-ink">
              {title}
            </strong>
            <span>{text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
