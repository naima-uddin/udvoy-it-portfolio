/**
 * All the site's content in one place, so the copy is easy to edit.
 *
 * Lines marked CONFIRM are business claims or commitments (numbers, guarantees, prices,
 * response times). They are sensible placeholders: check every one before going live, since
 * a claim a visitor can't trust does more harm than leaving it out.
 */

export const SITE = {
  name: "Ucchas",
  email: "hello@example.com", // CONFIRM: your real address
  /** shown under the contact form and in the FAQ */
  replyTime: "We reply within one business day", // CONFIRM
};

/** in-page sections the nav links to, in page order (each section is tracked under its id) */
export const SECTIONS = [
  { id: "services", label: "Services" },
  { id: "projects", label: "Work" },
  { id: "hiring", label: "Hire talent" },
  { id: "process", label: "Process" },
  { id: "team", label: "Team" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
] as const;

/** the numbers under the hero. CONFIRM: use only numbers you can back up */
export const STATS = [
  { to: 150, suffix: "+", label: "Projects delivered" },
  { to: 9, suffix: " yrs", label: "In business" },
  { to: 40, suffix: "+", label: "Remote hires placed" },
  { to: 98, suffix: "%", label: "Happy clients" },
];

/* ------------------------------------------------------------------ why Ucchas */

/** the line icons in components/LineIcon.tsx */
export type IconName = "bag" | "cart" | "browser" | "people" | "phone" | "pen" | "cube";

/** reasons to choose Ucchas, kept short */
export const WHY = [
  { title: "Commerce experts", text: "Shopify and e-commerce are our core work." },
  { title: "Senior team", text: "Experienced people do the work. You talk to them directly." },
  { title: "Clear pricing", text: "You get a fixed quote before we start." }, // CONFIRM
  { title: "Ongoing support", text: "We stay with you after launch." },
];

/* ------------------------------------------------------------------ services */

/** the four main services; each gets a large tile with a small illustration */
export type MainService = "shopify" | "commerce" | "web" | "hiring";

export type Service = {
  title: string;
  text: string;
  icon: IconName;
  /** set on the main services */
  main?: MainService;
  /** optional in-page link, e.g. "#hiring" */
  href?: string;
};

/** the main services first (Shopify, e-commerce, web, remote hiring), then the rest */
export const SERVICES: Service[] = [
  {
    main: "shopify",
    title: "Shopify development",
    text: "New stores, custom themes and apps, and moving your store to Shopify.",
    icon: "bag",
  },
  {
    main: "commerce",
    title: "E-commerce",
    text: "Online stores on WooCommerce, BigCommerce or custom code.",
    icon: "cart",
  },
  {
    main: "web",
    title: "Web development",
    text: "Company websites and web apps.",
    icon: "browser",
  },
  {
    main: "hiring",
    title: "Remote hiring",
    text: "Skilled developers and designers for your team.",
    icon: "people",
    href: "#hiring",
  },
  { title: "Mobile apps", text: "iOS and Android apps.", icon: "phone" },
  { title: "UI/UX design", text: "Clean designs people enjoy using.", icon: "pen" },
  { title: "Custom software", text: "Tools and systems for your business.", icon: "cube" },
];

/* ------------------------------------------------------------------ remote hiring */

export const HIRING = {
  modes: [
    { title: "Hire through Ucchas", text: "We find and hire the right person. You manage their work." },
    { title: "Fully managed team", text: "We hire the team and manage it for you." },
  ],
  roles: ["Shopify developer", "Web developer", "Mobile developer", "UI/UX designer", "QA tester", "E-commerce assistant"],
};

/* ------------------------------------------------------------------ process */

export const PROCESS = [
  { title: "Talk", when: "Day 1", text: "A free call about your idea." },
  { title: "Plan", when: "Week 1", text: "A clear plan and a fixed price." }, // CONFIRM
  { title: "Build", when: "Weeks 2–8", text: "Weekly updates you can see." },
  { title: "Launch", when: "Then", text: "We go live and keep supporting you." },
];

/* ------------------------------------------------------------------ team */

/**
 * The people a client will work with. Fill in `name` (and `photo`, a path under /public, and
 * `linkedin`) for real people; until a name is set, the card shows the role on its own.
 */
export const TEAM: { name: string; role: string; focus: string; photo?: string; linkedin?: string }[] = [
  { name: "", role: "Founder & CEO", focus: "Strategy and clients" },
  { name: "", role: "CTO", focus: "Technology and quality" },
  { name: "", role: "Shopify lead", focus: "Shopify stores and apps" },
  { name: "", role: "Design lead", focus: "UI/UX and branding" },
  { name: "", role: "Project manager", focus: "Planning and delivery" },
  { name: "", role: "Talent lead", focus: "Remote hiring" },
];

/* ------------------------------------------------------------------ testimonials */

/**
 * Real client quotes only. The section stays hidden while this list is empty.
 * Example: { quote: "…", name: "Jane Doe", role: "Founder", company: "Brand Co", photo: "/clients/jane.jpg" }
 */
export const TESTIMONIALS: { quote: string; name: string; role: string; company: string; photo?: string }[] = [];

/* ------------------------------------------------------------------ FAQ */

export const FAQ = [
  {
    q: "What does Ucchas do?",
    a: "We build Shopify stores, e-commerce sites, websites and apps, and help companies hire remote talent.",
  },
  {
    q: "How much does a project cost?",
    a: "It depends on the work. After a free call, we send you a clear, fixed price.",
  },
  {
    q: "How long does a project take?",
    a: "Most websites and stores take a few weeks. Bigger projects take one to three months.",
  },
  {
    q: "How does remote hiring work?",
    a: "Tell us the role. We send checked candidates, you choose, and we handle the contract and pay.",
  },
  {
    q: "Do you help after launch?",
    a: "Yes. We offer monthly support for fixes and updates.",
  },
];
