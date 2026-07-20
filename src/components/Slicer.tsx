import { useState } from "react";
import { Dropdown } from "./Dropdown";

/**
 * Power BI slicer visuals, recreated in React. Two shapes share one body:
 *   - MeasureSlicer - a "Dropdown" slicer: a labelled trigger showing the
 *     current value that opens a search + single-select list (Set Lines / Set
 *     Bars).
 *   - ListSlicer - a "List" slicer: a titled, collapsible card with an
 *     optional search box and a radio (single) or checkbox (multi) list, with
 *     an optional Select all (Plot By and the dimension filters).
 */

export interface SlicerOption {
  key: string;
  label: string;
}

/** The inside of a slicer: optional search, optional Select all, then rows. */
function SlicerBody({
  options,
  select,
  selected,
  onToggle,
  onToggleAll,
  search = false,
  selectAll = false,
  name,
}: {
  options: SlicerOption[];
  select: "single" | "multi";
  selected: Set<string>;
  onToggle: (key: string) => void;
  onToggleAll?: () => void;
  search?: boolean;
  selectAll?: boolean;
  name: string;
}) {
  const [q, setQ] = useState("");
  const filtered = search
    ? options.filter((o) => o.label.toLowerCase().includes(q.trim().toLowerCase()))
    : options;
  const allOn = options.length > 0 && options.every((o) => selected.has(o.key));

  return (
    <div className="slicer-body">
      {search && (
        <div className="right-search">
          <span className="search-icon" aria-hidden>⌕</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            aria-label={`Search ${name}`}
          />
        </div>
      )}
      <ul className="check-list" role={select === "single" ? "radiogroup" : "list"} aria-label={name}>
        {select === "multi" && selectAll && (
          <li>
            <label className="check-item select-all">
              <input
                type="checkbox"
                checked={allOn}
                onChange={onToggleAll}
                aria-label={`Select all ${name}`}
              />
              Select all
            </label>
          </li>
        )}
        {filtered.map((o) => (
          <li key={o.key}>
            <label className="check-item">
              <input
                type={select === "single" ? "radio" : "checkbox"}
                name={select === "single" ? `slicer-${name}` : undefined}
                checked={selected.has(o.key)}
                onChange={() => onToggle(o.key)}
              />
              {o.label}
            </label>
          </li>
        ))}
        {filtered.length === 0 && <li className="check-note">No matches.</li>}
      </ul>
    </div>
  );
}

/** A dropdown slicer for a single measure (Set Lines / Set Bars). */
export function MeasureSlicer({
  label,
  tour,
  value,
  onChange,
  options,
  align = "left",
}: {
  label: string;
  tour: string;
  value: string | null;
  onChange: (key: string | null) => void;
  options: SlicerOption[];
  align?: "left" | "right";
}) {
  const current = value ? options.find((o) => o.key === value)?.label ?? "(None)" : "(None)";
  const withNone: SlicerOption[] = [{ key: "", label: "(None)" }, ...options];
  return (
    <div className="selector-block" data-tour={tour}>
      <span className="selector-label">{label}</span>
      <Dropdown label={label} value={current} align={align}>
        {(close) => (
          <SlicerBody
            options={withNone}
            select="single"
            selected={new Set([value ?? ""])}
            onToggle={(key) => {
              onChange(key === "" ? null : key);
              close();
            }}
            search
            name={label}
          />
        )}
      </Dropdown>
    </div>
  );
}

/** A collapsible vertical-list slicer (Plot By and the dimension filters). */
export function ListSlicer({
  title,
  options,
  select,
  selected,
  onToggle,
  onToggleAll,
  search = false,
  selectAll = false,
  tour,
  defaultOpen = true,
}: {
  title: string;
  options: SlicerOption[];
  select: "single" | "multi";
  selected: Set<string>;
  onToggle: (key: string) => void;
  onToggleAll?: () => void;
  search?: boolean;
  selectAll?: boolean;
  tour?: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const count = select === "multi" ? selected.size : 0;
  const summary =
    select === "multi"
      ? count === options.length
        ? "All"
        : count === 0
          ? "None"
          : `${count} selected`
      : null;
  return (
    <section className="slicer" data-tour={tour}>
      <button
        type="button"
        className="slicer-header"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="slicer-title">{title}</span>
        {summary && !open && <span className="slicer-summary">{summary}</span>}
        <span className={open ? "slicer-chevron open" : "slicer-chevron"} aria-hidden>⌄</span>
      </button>
      {open && (
        <SlicerBody
          options={options}
          select={select}
          selected={selected}
          onToggle={onToggle}
          onToggleAll={onToggleAll}
          search={search}
          selectAll={selectAll}
          name={title}
        />
      )}
    </section>
  );
}
