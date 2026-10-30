import { cn } from "@/lib/cn";

/**
 * Search form that submits to the search page with ?q=. Works without JavaScript.
 * `compact` stacks the input and button for phones.
 */
export function SearchBar({
  action,
  label,
  placeholder,
  button,
  defaultValue,
  id = "q",
  compact = false,
  className,
}: {
  action: string;
  label: string;
  placeholder: string;
  button: string;
  defaultValue?: string;
  id?: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <form
      role="search"
      action={action}
      className={cn(
        "flex w-full gap-2 rounded-[12px] bg-white p-2 shadow-float",
        compact ? "flex-col" : "flex-col sm:flex-row",
        className,
      )}
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete="off"
        className="min-h-14 min-w-0 flex-1 bg-transparent px-4 text-ink outline-none placeholder:text-body"
      />
      <button
        type="submit"
        className="min-h-14 rounded-sm bg-primary px-9 font-semibold text-white transition-colors hover:bg-primary-hover"
      >
        {button}
      </button>
    </form>
  );
}
