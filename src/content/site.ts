/**
 * Single source of truth for every string, link and data row on the homepage.
 * Keeping copy out of the components makes the marketing content editable
 * without touching layout, and keeps the section files readable.
 */

export const brand = {
  name: "KRYPTONIX",
  tagline: "Digital & AI Solutions",
  positioning:
    "A complete business growth partner — we build the technology, bring the traffic, automate the work and help businesses grow.",
  phone: "+91 7004708826",
  phoneHref: "tel:+917004708826",
  email: "hello@kryptonix.com",
  emailHref: "mailto:hello@kryptonix.com",
  /** Rendered one line per entry inside the footer's <address>. */
  address: [
    "Anusha Villa, flat number G1.",
    "P. number 82 83 P, SP Colony,",
    "Moti Nagar, Hyderabad,",
    "Telangana 500018",
  ],
} as const;

/**
 * Primary conversion, reused in the header, hero and CTA banner. There is no
 * href: every instance opens the strategy-call form via the dialog provider.
 */
export const primaryCta = { label: "Book a Strategy Call" } as const;

/**
 * One-page site: "Case Studies" and "About Us" have no dedicated section in the
 * reference design, so they point at the closest real proof / story sections
 * rather than becoming dead links.
 */
export const nav = [
  { label: "Home", href: "#top" },
  { label: "Services", href: "#services" },
  { label: "Solutions", href: "#solutions" },
  { label: "Case Studies", href: "#results" },
  { label: "About Us", href: "#process" },
  { label: "Contact", href: "#contact" },
] as const;

export const hero = {
  badge: "Digital Growth + Software Solutions",
  headline: ["Build Better.", "Grow Faster.", "Scale Smarter."],
  lead: "We build powerful software, drive targeted traffic, automate operations and create growth systems that help businesses increase customers and revenue.",
  secondaryCta: { label: "Explore Our Solutions", href: "#solutions" },
  proof: ["Smart Software", "Growth Focused", "Results Driven"],
  imageAlt:
    "Kryptonix growth system: a consultant with a laptop surrounded by an orbit of SEO, Ads, Website, Software, Automation and Growth services",
} as const;

export type MetricIcon = "users" | "leads" | "retention" | "support" | "industries";

export const metrics: { value: string; label: string; icon: MetricIcon }[] = [
  { value: "250+", label: "Businesses Empowered", icon: "users" },
  { value: "50K+", label: "Leads Generated", icon: "leads" },
  { value: "98%", label: "Client Retention", icon: "retention" },
  { value: "24/7", label: "Support & Automation", icon: "support" },
  { value: "10+", label: "Industries Served", icon: "industries" },
];

export type ServiceIcon =
  | "code"
  | "search"
  | "target"
  | "bot"
  | "monitor"
  | "chart";

/** Which hand-authored vignette sits in the card's visual well. */
export type ServiceVisual = "code" | "rank" | "ads" | "flow" | "site" | "growth";

export const servicesHead = {
  badge: "Our services",
  /** Second half is set in the violet accent. */
  headline: ["What We Do For", "Your Business"],
  lead: "From first build to daily operations, we create, market and automate the systems your business needs to win more customers and run better.",
} as const;

/**
 * Six cards in a 3 x 2 grid. `tone` alternates diagonally (pink, lav, pink /
 * lav, pink, lav) so no two same-tinted cards touch, matching the reference
 * board. `points` is always four items — the card is sized around that.
 */
export const services: {
  num: string;
  title: [string, string];
  body: string;
  points: [string, string, string, string];
  cta: string;
  icon: ServiceIcon;
  visual: ServiceVisual;
  tone: "lav" | "pink";
}[] = [
  {
    num: "01",
    title: ["Software", "Development"],
    body: "Custom software built around the way your business actually works, not the other way round.",
    points: [
      "Built to your exact workflow",
      "Scalable and secure",
      "Third-party integrations",
      "Ongoing support included",
    ],
    cta: "Discuss Your Requirements",
    icon: "code",
    visual: "code",
    tone: "pink",
  },
  {
    num: "02",
    title: ["SEO", "That Ranks"],
    body: "Get found by the people already searching for what you sell, and turn that traffic into enquiries.",
    points: [
      "On-page and technical SEO",
      "Local and Google Business",
      "Authority link building",
      "Transparent rank reporting",
    ],
    cta: "Grow My Visibility",
    icon: "search",
    visual: "rank",
    tone: "lav",
  },
  {
    num: "03",
    title: ["Google", "Ads"],
    body: "Campaigns engineered for leads and bookings, with every rupee of spend accounted for.",
    points: [
      "Search, Display and Performance Max",
      "Conversion tracking set up properly",
      "Lower cost per lead over time",
      "Weekly optimisation",
    ],
    cta: "Launch Ads That Convert",
    icon: "target",
    visual: "ads",
    tone: "pink",
  },
  {
    num: "04",
    title: ["AI &", "Automation"],
    body: "Let software handle the repetitive work — follow-ups, reminders, data entry — so your team does not have to.",
    points: [
      "Instant lead follow-up",
      "WhatsApp and email journeys",
      "AI qualification and routing",
      "CRM kept up to date on its own",
    ],
    cta: "Automate My Business",
    icon: "bot",
    visual: "flow",
    tone: "lav",
  },
  {
    num: "05",
    title: ["Web", "Development"],
    body: "Fast, mobile-first websites designed to build trust and turn visitors into customers.",
    points: [
      "Modern responsive design",
      "Built for Core Web Vitals",
      "Online booking and enquiry forms",
      "SEO-ready structure",
    ],
    cta: "Get Your Website",
    icon: "monitor",
    visual: "site",
    tone: "pink",
  },
  {
    num: "06",
    title: ["Business", "Growth"],
    body: "Strategy, execution and measurement joined up into one system pointed at revenue.",
    points: [
      "Growth roadmap and priorities",
      "Funnel and conversion tuning",
      "Reporting you can act on",
      "A partner, not a vendor",
    ],
    cta: "Build My Growth Plan",
    icon: "chart",
    visual: "growth",
    tone: "lav",
  },
];

export const products = [
  {
    id: "salon-software",
    tone: "violet" as const,
    crop: "salon" as const,
    title: ["Salon Growth", "Management Software"],
    body: "Manage appointments, staff, customers, inventory, payroll, billing and grow your salon business effortlessly.",
    features: [
      "Appointments & Scheduling",
      "Staff & Payroll Management",
      "Inventory & Product Control",
      "Billing & Invoicing",
      "Customer Loyalty Program",
      "Business Analytics",
    ],
    cta: "Explore Salon Software",
    /** Opens the Salon "coming soon" dialog — see DialogProvider. */
    dialog: "salon" as const,
    imageAlt:
      "Kryptonix salon growth management software dashboard showing revenue overview, recent appointments and top services",
  },
  {
    id: "gym-software",
    tone: "pink" as const,
    crop: "gym" as const,
    title: ["Gym Management", "Software"],
    body: "All-in-one gym management system to manage members, trainers, workouts, attendance, payments and more.",
    features: [
      "Member Management",
      "Workout & Plans",
      "Attendance Tracking",
      "Payroll Management",
      "Inventory Control",
      "Reports & Analytics",
    ],
    cta: "Explore Gym Software",
    dialog: "gym" as const,
    imageAlt:
      "Kryptonix gym management software dashboard showing membership growth, member plans and popular workouts",
  },
];

export const seo = {
  badge: "SEO that brings you customers",
  headline: ["Rank Higher.", "Get More Customers."],
  lead: "We use proven SEO strategies to increase your visibility, drive organic traffic and grow your business.",
  pillars: [
    {
      title: "On-Page SEO",
      body: "Optimize your website for search engines and users.",
      icon: "onpage" as const,
    },
    {
      title: "Off-Page SEO",
      body: "Build authority with quality backlinks and mentions.",
      icon: "offpage" as const,
    },
    {
      title: "Local SEO",
      body: "Rank in your local area and drive footfall and calls.",
      icon: "local" as const,
    },
    {
      title: "SEO Analytics",
      body: "Track performance and improve what matters.",
      icon: "analytics" as const,
    },
  ],
  cta: "Grow My Visibility",
  imageAlt:
    "Kryptonix SEO specialist holding a magnifying glass, representing search visibility and organic discovery",
};

export const ads = {
  badge: "Ads that deliver results",
  headline: ["Don't Just Get Traffic.", "Get Real Results."],
  lead: "Targeted ad campaigns that bring quality leads, lower cost per lead and higher returns.",
  journey: [
    { label: "Ad Spend", icon: "spend" as const },
    { label: "Clicks", icon: "clicks" as const },
    { label: "Leads", icon: "leads" as const },
    { label: "Bookings", icon: "bookings" as const },
    { label: "Revenue", icon: "revenue" as const },
  ],
  /**
   * Directional outcomes rather than invented figures — these say what every
   * campaign is optimised toward without claiming unverified numbers.
   */
  optimise: [
    { label: "Ad Spend", trend: "down" as const, note: "Controlled" },
    { label: "Leads Generated", trend: "up" as const, note: "Higher" },
    { label: "Cost Per Lead", trend: "down" as const, note: "Lower" },
    { label: "Conversions", trend: "up" as const, note: "Higher" },
  ],
  cta: "Launch Ads That Convert",
  imageAlt:
    "Kryptonix paid ads specialist reviewing campaign performance on a phone",
};

export const automation = {
  badge: "Automate. Save time. Grow more.",
  headline: ["Let Your Business", "Run on Autopilot."],
  lead: "We use AI and automation to handle repetitive tasks, improve response times and free your team to focus on growth.",
  flow: [
    { label: "Lead Comes In", icon: "lead" as const },
    { label: "AI Qualifies Lead", icon: "qualify" as const },
    { label: "Instant Follow-Up", icon: "followup" as const },
    { label: "Appointment Booked", icon: "booked" as const },
    { label: "CRM Updated", icon: "crm" as const },
  ],
  outcomes: ["Faster response times", "No missed leads", "More time for growth"],
  cta: "Automate My Business",
};

export const process = {
  badge: "Our process",
  headline: "From Strategy to Growth.",
  lead: "A simple process that delivers powerful results.",
  steps: [
    {
      num: "01",
      title: "Discover",
      body: "We understand your business, audience and goals.",
    },
    {
      num: "02",
      title: "Plan",
      body: "We create a data-driven strategy tailored to your business.",
    },
    {
      num: "03",
      title: "Build & Launch",
      body: "We build, implement and launch everything to get results.",
    },
    {
      num: "04",
      title: "Optimize",
      body: "We measure, analyze and optimize for maximum growth.",
    },
  ],
  imageAlt:
    "The Kryptonix team planning a client growth strategy together around a laptop",
};

export const results = {
  badge: "Real results. Real growth.",
  headline: ["We Focus on What", "Matters — Your Growth!"],
  items: ["More Traffic", "More Leads", "More Customers", "More Revenue"],
};

export const finalCta = {
  headline: ["Ready to Build Your", "Growth Engine?"],
  lead: "Let's build the software, marketing and automation systems your business needs to scale.",
  imageAlt: "Kryptonix growth strategist pointing towards the strategy call booking button",
};

export const footerColumns = [
  {
    title: "Company",
    links: [
      { label: "Home", href: "#top" },
      { label: "Services", href: "#services" },
      { label: "Solutions", href: "#solutions" },
      { label: "Case Studies", href: "#results" },
      { label: "About Us", href: "#process" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Salon Software", href: "#salon-software" },
      { label: "Gym Software", href: "#gym-software" },
      { label: "Growth Solutions", href: "#results" },
      { label: "Automation", href: "#automation" },
      { label: "Analytics & Reporting", href: "#process" },
    ],
  },
] as const;

/**
 * Coming-soon dialogs behind the two "Explore … Software" buttons. Copy is
 * fixed by the brief — neither product ships yet, so nothing here may describe
 * a feature as available.
 */
export const comingSoon = {
  salon: {
    title: "XING Salon Software",
    tagline: "Everything you need to manage your salon, in one place.",
    body: "Manage your day-to-day operations with a smarter, simpler digital system built for modern salons.",
  },
  gym: {
    title: "XING Gym Software",
    tagline: "A smarter way to manage your gym.",
    body: "We're building a complete digital solution designed to make gym management easier and more efficient.",
  },
} as const;

export const comingSoonShared = {
  flag: "Coming soon",
  detail: (name: string) =>
    `We're currently putting the finishing touches on ${name}.`,
  ask: "Want early access?",
  askBody: "Contact us and we'll help you get started.",
  primary: "Talk to Us",
  secondary: "Close",
} as const;

/** Strategy-call form. */
export const leadForm = {
  title: "Let's Talk About Your Growth.",
  lead: "Tell us a little about your business and what you want to improve. We'll get back to you with the right next step.",
  interests: [
    "Software Development",
    "SEO",
    "Google Ads",
    "AI & Automation",
    "Web Development",
    "Business Growth",
    "Salon Software",
    "Gym Software",
    "Something Else",
  ],
  submit: "Let's Talk",
  success: {
    title: "Thanks — we've received your request.",
    body: "We'll be in touch soon.",
  },
} as const;

/**
 * Crop windows into `public/assets/kryptonix-people.png` (natural 1536 x 1024).
 * Derived from an alpha-occupancy scan of the supplied sheet — the sheet is
 * cropped with CSS at render time so no derivative image files are produced.
 */
export const PEOPLE_SHEET = { src: "/assets/kryptonix-people.png", w: 1536, h: 1024 } as const;

/**
 * Product dashboards, cropped out of the high-resolution supplied sheet.
 * Boxes are tight around each dashboard block (dark sidebar + white panel) so
 * no card background comes with them — the sheet's own ground is deeper
 * (#EAD7FD salon / #FED4EC gym) than the page's card colours, so any margin
 * would show as a rectangle. The panel is framed with CSS instead.
 */
export const PRODUCT_SHEET = { src: "/assets/product-dashboards.png", w: 1536, h: 1024 } as const;

export const productCrops = {
  // Panel only, starting right of the dark nav rail: in the sheet the salon
  // chair and the gym dumbbell both overlap that rail (they reach x~811), so
  // including it would drag a slice of each prop in with it.
  // Panel spans x 808-1505; salon y 13-518, gym y 566 to the sheet's bottom edge.
  salon: { sx: 809, sy: 10, sw: 698, sh: 510 },
  gym: { sx: 809, sy: 563, sw: 698, sh: 460 },
} as const;

export const peopleCrops = {
  team: { sx: 400, sy: 0, sw: 730, sh: 530 },
} as const;

/**
 * Final-CTA cut-out, extracted from the supplied
 * `kryptonix_seo_girl_cutout footer.svg` (a PNG wrapped in an <svg><image>)
 * and trimmed to its alpha bounding box. A real cut-out with a genuine alpha
 * channel, so unlike the sprite crop it replaced it needs no clip-path and
 * renders at full density.
 */
export const CTA_PERSON = { src: "/assets/cta-person.png", w: 1235, h: 1153 } as const;

/**
 * Logo, extracted the same way from `kryptonix_logo.svg` and trimmed to its
 * alpha bounding box so it can be sized by height with no phantom padding.
 * Already contains the wordmark and strapline — do not set them again in text.
 */
export const LOGO = { src: "/assets/kryptonix-logo.png", w: 1950, h: 631 } as const;
