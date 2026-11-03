/**
 * Single source of truth for every string, link and data row on the homepage.
 * Keeping copy out of the components makes the marketing content editable
 * without touching layout, and keeps the section files readable.
 */

/**
 * Production origin, no trailing slash. Drives metadataBase (canonical and
 * Open Graph URLs), the JSON-LD `url`, robots.txt and sitemap.xml.
 */
export const SITE_URL = "https://kryptonix.digital";

export const brand = {
  name: "KRYPTONIX",
  tagline: "Digital & AI Solutions",
  positioning:
    "A complete business growth partner — we build the technology, bring the traffic, automate the work and help businesses grow.",
  phone: "+91 7004708826",
  phoneHref: "tel:+917004708826",
  email: "support@kryptonix.digital",
  emailHref: "mailto:support@kryptonix.digital",
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
 * One-page site. "About Us" points at the process/results band, which is the
 * closest thing to a story section; everything else resolves to a real id.
 * Careers lives in the footer only, to keep the header at six items.
 */
export const nav = [
  { label: "Home", href: "#top" },
  { label: "Services", href: "#services" },
  { label: "Solutions", href: "#solutions" },
  { label: "Case Studies", href: "#case-studies" },
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
  | "cog"
  | "globe"
  | "search"
  | "megaphone"
  | "phoneCall"
  | "chart";

/**
 * Short label used under the banner illustration on phones, where the arc of
 * six icons in the artwork is too small to read.
 */
export type ServiceChip = { label: string; icon: ServiceIcon };

export const servicesHead = {
  badge: "Our services",
  /** Rendered as: plain / violet accent / pink accent. */
  headline: ["What We Do For", "Salons", "& Gyms"],
  lead: "We don't just market your business — we build the software, ads, and automation that run it.",
  bannerAlt:
    "A salon owner and a gym owner each working on a laptop, ringed by the six Kryptonix services: management software, website and booking, local SEO, ads that convert, missed-call automation and growth playbook.",
} as const;

/**
 * Six cards in a 3 x 2 grid, collapsing to 2 then 1 column. `tone` alternates
 * diagonally (lav, pink, lav / pink, lav, pink) so no two same-tinted cards
 * ever touch. `points` is four items on every card except 01, which carries
 * five in the reference artwork.
 */
export const services: {
  num: string;
  title: [string, string];
  body: string;
  /** One-line blurb for the compact 2 x 3 phone grid, where `body` is too long.
   *  The compact card's title comes from `serviceChips`, which is index-aligned
   *  with this array. */
  short: string;
  points: string[];
  cta: string;
  icon: ServiceIcon;
  tone: "lav" | "pink";
}[] = [
  {
    num: "01",
    title: ["Salon & Gym", "Management Software"],
    body: "Custom booking, staff, payroll, and inventory systems tailored to how your business actually runs.",
    short: "Custom booking, staff, payroll, and inventory systems.",
    points: [
      "Built to your exact workflow",
      "Staff scheduling & payroll",
      "Inventory & stock tracking",
      "Client records & history",
      "Ongoing support included",
    ],
    cta: "Build My Software",
    icon: "cog",
    tone: "lav",
  },
  {
    num: "02",
    title: ["Salon & Gym", "Website & Booking Pages"],
    body: "Fast, mobile-first websites built to turn visitors into booked appointments and members.",
    short: "Fast, mobile-first websites to turn visitors into booked clients.",
    points: [
      "Online booking built in",
      "Mobile-first design",
      "Fast load times",
      "SEO-ready structure",
    ],
    cta: "Get My Website",
    icon: "globe",
    tone: "pink",
  },
  {
    num: "03",
    title: ["Local SEO", "for Salons & Gyms"],
    body: "Get found first when someone nearby searches for a salon or gym like yours.",
    short: "Get found first when someone nearby searches for a salon or gym.",
    points: [
      "Google Business Profile optimization",
      "Local keyword targeting",
      "Verified backlink building",
      "Monthly ranking reports",
    ],
    cta: "Grow My Visibility",
    icon: "search",
    tone: "lav",
  },
  {
    num: "04",
    title: ["Ads That", "Convert"],
    body: "Google and Meta campaigns built around calls and bookings, not just clicks.",
    short: "Google and Meta campaigns built around calls and bookings, not just clicks.",
    points: [
      "Google & Meta ad management",
      "Call tracking on every campaign",
      "Lower cost per lead",
      "Transparent spend reporting",
    ],
    cta: "Launch Ads That Convert",
    icon: "megaphone",
    tone: "pink",
  },
  {
    num: "05",
    title: ["Missed-Call &", "Appointment Automation"],
    body: "Every missed call is a lost client. We make sure none of them slip through.",
    short: "Every missed call is a lost client. We make sure none slip through.",
    points: [
      "Missed-call text-back",
      "Automated appointment reminders",
      "WhatsApp/SMS follow-up",
      "Lead routing to your team",
    ],
    cta: "Automate My Business",
    icon: "phoneCall",
    tone: "lav",
  },
  {
    num: "06",
    title: ["Growth Playbook", "for Owners"],
    body: "Ongoing strategy on pricing, staffing, and offers — based on your own numbers.",
    short: "Ongoing strategy on pricing, staffing, and offers — based on your own numbers.",
    points: [
      "Pricing & offer strategy",
      "Staffing recommendations",
      "Monthly growth reporting",
      "A partner, not a vendor",
    ],
    cta: "Build My Growth Plan",
    icon: "chart",
    tone: "pink",
  },
];

/** Short titles for the compact 2 x 3 phone grid — the live, legible
 *  restatement of the banner's baked icon arc. Index-aligned with `services`. */
export const serviceChips: ServiceChip[] = [
  { label: "Management Software", icon: "cog" },
  { label: "Website & Booking", icon: "globe" },
  { label: "Local SEO", icon: "search" },
  { label: "Ads That Convert", icon: "megaphone" },
  { label: "Missed-Call Automation", icon: "phoneCall" },
  { label: "Growth Playbook", icon: "chart" },
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
      { label: "Case Studies", href: "#case-studies" },
      { label: "About Us", href: "#process" },
      { label: "Careers", href: "#careers" },
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

/**
 * Work in progress, stated honestly. Nothing here may claim a finished result,
 * a client outcome or a completion percentage — both products are still being
 * built, and the section exists to say exactly that.
 */
export const caseStudies = {
  badge: "In progress",
  /** Rendered as: plain / violet accent / pink accent. */
  headline: ["What We're Building", "Right", "Now"],
  lead: "Real projects, real businesses — results coming soon.",
  projects: [
    {
      id: "salon-platform",
      tag: "Salon · In Development",
      title: "Salon Growth & Management Platform",
      body: "Booking, payroll, and inventory — replacing five tools with one dashboard.",
      status: "In active development",
      /** Visual weight of the bar only. Deliberately unlabelled: a number here
       *  would read as a completion stat, which we cannot substantiate. */
      progress: 0.6,
      icon: "scissors" as const,
      tone: "pink" as const,
    },
    {
      id: "gym-platform",
      tag: "Gym · In Development",
      title: "Gym Operations & Growth Platform",
      body: "Memberships, scheduling, and payroll — built for how gyms actually run.",
      status: "In active development",
      progress: 0.4,
      icon: "dumbbell" as const,
      tone: "violet" as const,
    },
  ],
  link: "Follow this project",
} as const;

/**
 * Careers. `roles` drives the whole section: list any number of openings and
 * they render as rows with their own Apply button; leave it empty and the
 * section falls back to the open application card instead. Either way every
 * button opens the same application form.
 */
export const careers = {
  badge: "Careers",
  /** Rendered as: plain / violet accent / pink accent. */
  headline: ["Building Something?", "Join", "Us."],
  lead: "We're a small team building real software for real businesses — not chasing vanity metrics.",
  roles: [
    {
      id: "frontend",
      title: "Frontend Developer",
      blurb: "Help us build the salon & gym dashboards.",
      icon: "code" as const,
    },
    {
      id: "backend",
      title: "Backend Developer",
      blurb: "Build scalable APIs and integrations.",
      icon: "server" as const,
    },
    {
      id: "design",
      title: "UI/UX Designer",
      blurb: "Create beautiful, easy-to-use experiences.",
      icon: "brush" as const,
    },
  ],
  perks: [
    {
      icon: "rocket" as const,
      title: "Ship real products",
      body: "Work on software that makes a real impact.",
    },
    {
      icon: "users" as const,
      title: "Work directly with founders",
      body: "Small team, big opportunities.",
    },
    {
      icon: "chart" as const,
      title: "Room to grow with us",
      body: "Learn, contribute, and grow your career.",
    },
  ],
  apply: "Apply",
  openTitle: "Don't see a role that fits?",
  openBody: "We're always happy to hear from talented people — send us your resume.",
  openCta: "Send Your Resume",
  emptyTitle: "No open roles right now",
  emptyBody:
    "We're not hiring for a specific position at the moment, but we always want to meet good people.",
} as const;

/** Job application form, opened from every Careers CTA. */
export const applicationForm = {
  title: "Apply to Kryptonix",
  lead: "Tell us who you are and what you'd like to work on. We read every application.",
  generalRole: "General application",
  /** Matches the server-side cap in src/app/api/careers/route.ts. */
  maxResumeMb: 5,
  accept: ".pdf,.doc,.docx",
  submit: "Submit Application",
  success: {
    title: "Thanks — we've received your application.",
    body: "We'll shortly connect with you.",
  },
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
