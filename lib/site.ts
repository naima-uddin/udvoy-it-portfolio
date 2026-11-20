/**
 * All the site's content in one place, so the copy is easy to edit.
 *
 * Lines marked CONFIRM are business claims or commitments (numbers, guarantees, prices,
 * response times). They are sensible placeholders: check every one before going live, since
 * a claim a visitor can't trust does more harm than leaving it out.
 */

export const SITE = {
  name: "UDVOY IT",
  /** the brand slogan, shown in the hero and the share image */
  slogan: "Innovate. Create. Elevate.",
  tagline: "Empowering Businesses Through Technology.",
  email: "hello@example.com", // CONFIRM: your real company address (not a personal Gmail)
  /** where the team works from */
  locations: "Bangladesh & Pakistan",
  founded: 2026,
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

/** the numbers under the hero: real figures from the team list. Add project counts once you can back them up */
export const STATS = [
  { to: 13, suffix: "", label: "Team members" },
  { to: 6, suffix: "", label: "Departments" },
  { to: 2, suffix: "", label: "Countries" },
  { to: 2026, from: 2016, suffix: "", label: "Founded" },
];

/* ------------------------------------------------------------------ why UDVOY IT */

/** the line icons in components/LineIcon.tsx */
export type IconName = "bag" | "cart" | "browser" | "people" | "phone" | "pen" | "cube" | "search" | "table" | "chat";

/** reasons to choose UDVOY IT, kept short (from the brand messaging) */
export const WHY = [
  { title: "Our mission", text: "Empowering ideas through technology, and making it work for everyone." },
  { title: "Our vision", text: "Building a smarter digital future, one project at a time." },
  { title: "One team", text: "Developers, SEO specialists, researchers and support under one roof." },
  { title: "Your success", text: "Your vision. Our innovation. One shared success." },
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
    text: "Company websites, web apps and custom software.",
    icon: "browser",
  },
  {
    main: "hiring",
    title: "Remote hiring",
    text: "Skilled developers and designers for your team.",
    icon: "people",
    href: "#hiring",
  },
  { title: "SEO", text: "Get found on Google and grow your organic traffic.", icon: "search" },
  { title: "Data entry & research", text: "Accurate data entry, list building and web research.", icon: "table" },
  { title: "Customer support", text: "Friendly support for your customers by chat, email and phone.", icon: "chat" },
];

/* ------------------------------------------------------------------ remote hiring */

export const HIRING = {
  modes: [
    { title: "Hire through UDVOY IT", text: "We find and hire the right person. You manage their work." },
    { title: "Fully managed team", text: "We hire the team and manage it for you." },
  ],
  roles: [
    "Shopify developer",
    "Web developer",
    "SEO specialist",
    "Data entry executive",
    "Customer service representative",
    "E-commerce assistant",
  ],
};

/* ------------------------------------------------------------------ process */

export const PROCESS = [
  { title: "Talk", when: "Day 1", text: "A free call about your idea." },
  { title: "Plan", when: "Week 1", text: "A clear plan and a fixed price." }, // CONFIRM
  { title: "Build", when: "Weeks 2–8", text: "Weekly updates you can see." },
  { title: "Launch", when: "Then", text: "We go live and keep supporting you." },
];

/* ------------------------------------------------------------------ team */

export type Member = {
  /** employee ID: unique, used as the card key so a person can never show twice */
  id: string;
  name: string; role: string;
  focus: string;
  photo?: string;
  linkedin?: string;
};

/**
 * The UDVOY IT team, in employee-ID order (UDV-EMP-001 onward). Photos live in public/team/.
 * Only public details go here: no phone numbers, personal emails or other private data.
 * Add a `linkedin` URL to show a LinkedIn button on a card.
 */
export const TEAM: Member[] = [
  { id: "UDV-EMP-001", name: "Md. Shamim Raza", role: "Co-Founder", focus: "Management", photo: "/team/shamim-raza.jpg" },
  { id: "UDV-EMP-002", name: "Md. Tanven Arerin Sazid", role: "Co-Founder", focus: "Management", photo: "/team/tanven-arerin-sazid.jpg" },
  { id: "UDV-EMP-003", name: "Abdur Rabby", role: "Co-Founder", focus: "Management", photo: "/team/abdur-rabby.jpg" },
  { id: "UDV-EMP-004", name: "Md. Naymul Hoque", role: "HR Manager", focus: "Human Resources", photo: "/team/naymul-hoque.jpg" },
  { id: "UDV-EMP-005", name: "Laiba Ahsan", role: "SEO Specialist", focus: "SEO", photo: "/team/laiba-ahsan.jpg" },
  { id: "UDV-EMP-006", name: "Sania Kousar", role: "SEO Specialist", focus: "SEO", photo: "/team/sania-kousar.jpg" },
  { id: "UDV-EMP-007", name: "Omar Faruk", role: "Data Entry Executive", focus: "Data Research", photo: "/team/omar-faruk.jpg" },
  { id: "UDV-EMP-008", name: "Md. Shihab Rahman", role: "Data Entry Executive", focus: "Data Research", photo: "/team/shihab-rahman.jpg" },
  { id: "UDV-EMP-009", name: "Md. Faisal Islam", role: "Customer Service Representative", focus: "Customer Service", photo: "/team/faisal-islam.jpg" },
  { id: "UDV-EMP-010", name: "Fahim Ifteker Ahmed", role: "Customer Service Representative", focus: "Customer Service", photo: "/team/fahim-ifteker-ahmed.jpg" },
  { id: "UDV-EMP-011", name: "Md. Motaleb Hosen", role: "Data Entry Executive", focus: "Data Research", photo: "/team/motaleb-hosen.jpg" },
  { id: "UDV-EMP-012", name: "Md. Mamunur Rashid", role: "Data Entry Executive", focus: "Data Research", photo: "/team/mamunur-rashid.jpg" },
  { id: "UDV-EMP-013", name: "Rai An", role: "Web Developer", focus: "Information Technology" }, // CONFIRM: add a photo at /team/rai-an.jpg
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
    q: "What does UDVOY IT do?",
    a: "We build Shopify stores, e-commerce sites and websites, and offer SEO, data entry and research, customer support and remote hiring.",
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
