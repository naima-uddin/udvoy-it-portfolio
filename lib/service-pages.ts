/**
 * One page per service at /services/[slug] (app/services/[slug]/page.tsx), so each service can
 * rank in search on its own. The slugs match `slug` on SERVICES in lib/site.ts.
 *
 * Plain, checkable descriptions only: no made-up numbers, clients or guarantees.
 */

export type ServicePage = {
  slug: string;
  /** the H1 and the name used in links */
  name: string;
  /** about 60 characters: the link text in search results (" | UDVOY IT" is added) */
  title: string;
  /** about 155 characters: the snippet in search results */
  description: string;
  /** a few sentences under the heading */
  intro: string;
  /** what the service covers */
  includes: { title: string; text: string }[];
  /** who it's a good fit for */
  forWho: string[];
  faq: { q: string; a: string }[];
};

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: "shopify-development",
    name: "Shopify development",
    title: "Shopify Development Company: Stores, Themes & Apps",
    description:
      "UDVOY IT builds Shopify and Shopify Plus stores: new stores, custom themes, apps and migrations from WooCommerce, BigCommerce or other platforms.",
    intro:
      "Shopify is our core work. We set up new stores, design and build custom themes, add the apps and features your store needs, and move existing stores to Shopify without losing your products, customers or search rankings.",
    includes: [
      { title: "New Shopify stores", text: "Store setup, theme, products, payments, shipping and taxes, ready to sell." },
      { title: "Custom themes", text: "A design made for your brand, fast on mobile and easy for you to edit." },
      { title: "Apps & features", text: "Custom Shopify apps, app setup and integrations with the tools you already use." },
      { title: "Migration to Shopify", text: "Products, customers, orders and redirects moved from WooCommerce, BigCommerce or custom stores." },
      { title: "Shopify Plus", text: "Checkout changes, B2B, multiple stores and automation for growing brands." },
      { title: "Speed & fixes", text: "Faster pages, theme bug fixes and ongoing store support." },
    ],
    forWho: [
      "Brands starting a new online store",
      "Stores moving to Shopify from another platform",
      "Shopify stores that need a redesign, new features or a faster theme",
    ],
    faq: [
      {
        q: "Can you move my store to Shopify?",
        a: "Yes. We move products, customers and orders, and set up redirects so your old links and search rankings keep working.",
      },
      {
        q: "Do you work with Shopify Plus?",
        a: "Yes. We build and customise Shopify Plus stores, including checkout changes, B2B and automation.",
      },
      {
        q: "Will I be able to edit the store myself?",
        a: "Yes. We build themes you can edit in the Shopify editor, and show you how to manage products, pages and orders.",
      },
    ],
  },
  {
    slug: "ecommerce-development",
    name: "E-commerce development",
    title: "E-commerce Development: WooCommerce, BigCommerce & Custom",
    description:
      "UDVOY IT builds online stores on WooCommerce, BigCommerce or custom code, with product setup, payments, integrations and ongoing store support.",
    intro:
      "Not every store belongs on Shopify. We build online stores on WooCommerce, BigCommerce or custom code, connect them to your payments, shipping and stock, and keep them running after launch.",
    includes: [
      { title: "WooCommerce stores", text: "Online stores on WordPress, with the plugins and custom features you need." },
      { title: "BigCommerce stores", text: "Store setup, themes and integrations on BigCommerce." },
      { title: "Custom e-commerce", text: "Stores built from scratch when your products or checkout don't fit a platform." },
      { title: "Integrations", text: "Payments, shipping, stock, accounting and marketplace connections." },
      { title: "Product uploads", text: "Products, photos, variants and descriptions added and kept up to date." },
      { title: "Store support", text: "Updates, fixes and day-to-day help after the store goes live." },
    ],
    forWho: [
      "Businesses on WordPress that want to sell online",
      "Stores with products, pricing or checkout a standard platform can't handle",
      "Store owners who need ongoing help running their shop",
    ],
    faq: [
      {
        q: "Should I use Shopify or WooCommerce?",
        a: "It depends on your products, budget and how much control you need. We'll recommend the platform that fits in a free call.",
      },
      {
        q: "Can you connect my store to my other systems?",
        a: "Yes. We connect stores to payment, shipping, stock, accounting and marketplace tools.",
      },
    ],
  },
  {
    slug: "web-development",
    name: "Web development",
    title: "Web Development Company: Websites, Web Apps & Software",
    description:
      "UDVOY IT builds company websites, web apps and custom software: fast, mobile-friendly and built to be found on Google.",
    intro:
      "We build company websites, web apps and custom tools. Every site is fast, works well on phones and is set up so search engines can find and understand it.",
    includes: [
      { title: "Company websites", text: "Clear, fast websites that explain what you do and bring in enquiries." },
      { title: "Web apps", text: "Booking systems, dashboards, portals and other tools that run in the browser." },
      { title: "Custom software", text: "Software built around how your business actually works." },
      { title: "Landing pages", text: "Focused pages for campaigns, products and launches." },
      { title: "SEO-ready builds", text: "Clean code, fast pages and the technical SEO done from the start." },
      { title: "Support & updates", text: "Changes, fixes and new features after launch." },
    ],
    forWho: [
      "Companies that need a new or better website",
      "Businesses that need a custom web app or internal tool",
      "Startups building their first product",
    ],
    faq: [
      {
        q: "Will my website work on phones?",
        a: "Yes. Every site we build is designed for phones, tablets and desktops.",
      },
      {
        q: "Can you build a web app, not just a website?",
        a: "Yes. We build web apps such as booking systems, dashboards and customer portals.",
      },
    ],
  },
  {
    slug: "remote-hiring",
    name: "Remote hiring & management",
    title: "Hire Remote Employees: Remote Hiring & Managed Teams",
    description:
      "UDVOY IT hires skilled remote employees in Bangladesh and Pakistan and can manage their daily work for you: developers, SEO, data entry and support.",
    intro:
      "We find, hire and manage skilled remote employees for your business, working from Bangladesh and Pakistan. Hire through us and manage the work yourself, or let us run the team day to day and report to you.",
    includes: [
      { title: "Hire through UDVOY IT", text: "We find and hire the right person. You manage their work." },
      { title: "Fully managed team", text: "We hire the team, manage their daily work and report to you." },
      { title: "Shopify & web developers", text: "Developers for your store, website or web app." },
      { title: "SEO specialists", text: "People to grow your search traffic and content." },
      { title: "Data entry & research", text: "Accurate data entry, product uploads, list building and web research." },
      { title: "Customer service", text: "Support staff for chat, email and phone." },
    ],
    forWho: [
      "Businesses that want skilled staff without hiring locally",
      "Store owners who need help with daily e-commerce work",
      "Companies that want a team managed for them",
    ],
    faq: [
      {
        q: "What roles can you hire for?",
        a: "Shopify and web developers, SEO specialists, data entry executives, customer service representatives and e-commerce assistants.",
      },
      {
        q: "Who manages the remote employees?",
        a: "Your choice. You can manage them yourself, or we manage their daily work and report to you.",
      },
      {
        q: "Where do the employees work from?",
        a: "Our team works from Bangladesh and Pakistan.",
      },
    ],
  },
  {
    slug: "seo",
    name: "SEO services",
    title: "SEO Services: Get Found on Google",
    description:
      "UDVOY IT's SEO services help your website and online store get found on Google: technical SEO, on-page SEO, content and store SEO.",
    intro:
      "We help your website and online store get found on Google and grow organic traffic, with technical fixes, better pages and content your customers are searching for.",
    includes: [
      { title: "Technical SEO", text: "Speed, indexing, sitemaps, structured data and crawl errors fixed." },
      { title: "On-page SEO", text: "Titles, descriptions, headings and content tuned for the right searches." },
      { title: "Keyword research", text: "Finding the searches your customers actually use." },
      { title: "Store SEO", text: "Product and collection pages set up to rank on Shopify and WooCommerce." },
      { title: "Content", text: "Pages and articles that answer your customers' questions." },
      { title: "Reporting", text: "Regular updates on rankings and traffic." },
    ],
    forWho: [
      "Online stores that want more organic sales",
      "Company websites that don't show up on Google",
      "Businesses moving to a new site without losing rankings",
    ],
    faq: [
      {
        q: "How long does SEO take?",
        a: "SEO builds over time. Technical fixes can help quickly, while rankings for competitive searches usually take months.",
      },
      {
        q: "Do you do SEO for Shopify stores?",
        a: "Yes. We optimise product and collection pages, speed and structured data on Shopify and WooCommerce stores.",
      },
    ],
  },
  {
    slug: "data-entry",
    name: "Data entry & research",
    title: "Data Entry & Web Research Services",
    description:
      "UDVOY IT offers accurate data entry, product uploads, list building and web research, done by a trained remote team.",
    intro:
      "Our data team handles accurate data entry, product uploads, list building and web research, so your team can focus on the work that grows your business.",
    includes: [
      { title: "Data entry", text: "Accurate entry into spreadsheets, CRMs and online systems." },
      { title: "Product uploads", text: "Products, photos, variants and descriptions added to your store." },
      { title: "List building", text: "Lead and contact lists researched and organised." },
      { title: "Web research", text: "Information found, checked and organised for you." },
      { title: "Data cleanup", text: "Duplicates removed and records fixed and formatted." },
    ],
    forWho: [
      "Online stores with many products to upload or update",
      "Sales teams that need lead lists",
      "Businesses with large amounts of data to enter or clean",
    ],
    faq: [
      {
        q: "Can you upload products to my store?",
        a: "Yes. We add products, photos, variants and descriptions to Shopify, WooCommerce and other platforms.",
      },
      {
        q: "Can I hire a dedicated data entry person?",
        a: "Yes. Through our remote hiring service you can have a dedicated data entry executive working for you.",
      },
    ],
  },
  {
    slug: "customer-support",
    name: "Customer support",
    title: "Customer Support Outsourcing: Chat, Email & Phone",
    description:
      "UDVOY IT provides friendly customer support for your business by chat, email and phone, with a trained remote support team.",
    intro:
      "We give your customers friendly, helpful support by chat, email and phone, with a trained remote team that learns your products and follows your way of working.",
    includes: [
      { title: "Live chat", text: "Quick answers for customers on your website or store." },
      { title: "Email support", text: "Customer emails answered clearly and on time." },
      { title: "Phone support", text: "Calls handled by trained representatives." },
      { title: "Order help", text: "Order status, returns and refunds handled for online stores." },
      { title: "Help content", text: "FAQs and saved replies written so customers get consistent answers." },
    ],
    forWho: [
      "Online stores with growing customer questions",
      "Businesses that want longer support hours",
      "Teams that want support handled without hiring locally",
    ],
    faq: [
      {
        q: "Which support channels do you cover?",
        a: "Chat, email and phone.",
      },
      {
        q: "Will the support team know my products?",
        a: "Yes. The team learns your products, policies and tone before talking to your customers.",
      },
    ],
  },
];

export const servicePage = (slug: string) => SERVICE_PAGES.find((p) => p.slug === slug);
