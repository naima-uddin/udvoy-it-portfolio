import type { IconName } from "@/lib/site";

/** simple line icons, drawn on a 24×24 grid with a 1.6px stroke (styled by .line-icon) */
const PATHS: Record<IconName, React.ReactNode> = {
  bag: (
    <>
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4h2.5l2.2 10.5h10.6L20.5 7H6.4" />
      <circle cx="9.5" cy="19" r="1.4" />
      <circle cx="16.5" cy="19" r="1.4" />
    </>
  ),
  browser: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <path d="M3 9h18" />
      <path d="M6.5 6.75h.01M9 6.75h.01" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19.5a5.5 5.5 0 0 1 11 0" />
      <path d="M15.5 5.8a3 3 0 0 1 0 5.4" />
      <path d="M17.2 14.3a5.5 5.5 0 0 1 3.3 5.2" />
    </>
  ),
  phone: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2.2" />
      <path d="M11 18.5h2" />
    </>
  ),
  pen: (
    <>
      <path d="M4 20l4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20z" />
      <path d="M14 7.5l2.5 2.5" />
    </>
  ),
  cube: (
    <>
      <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3z" />
      <path d="M4 7.5l8 4.5 8-4.5" />
      <path d="M12 12v9" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l5.5 5.5" />
    </>
  ),
  table: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M3.5 14.5h17M9.5 9.5v10" />
    </>
  ),
  chat: (
    <>
      <path d="M4 5.5h16v10H10l-4 3.5v-3.5H4v-10z" />
      <path d="M8 10.5h.01M12 10.5h.01M16 10.5h.01" />
    </>
  ),
};

export default function LineIcon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg className={`line-icon ${className}`} viewBox="0 0 24 24" aria-hidden>
      {PATHS[name]}
    </svg>
  );
}
