import {
  Bot,
  Brush,
  Building2,
  CalendarCheck,
  ChartNoAxesColumnIncreasing,
  CodeXml,
  CreditCard,
  Database,
  Dumbbell,
  FileSearch,
  Gauge,
  Globe,
  Headset,
  Link2,
  MapPin,
  Megaphone,
  Monitor,
  MousePointerClick,
  PhoneCall,
  Rocket,
  Scissors,
  Search,
  Send,
  Server,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

/**
 * Central icon registry. Sections reference icons by string key from
 * `content/site.ts`, which keeps the content layer free of React imports.
 */
export const icons = {
  // Metric strip
  users: Users,
  leads: TrendingUp,
  retention: ShieldCheck,
  support: Headset,
  industries: Building2,

  // Services
  code: CodeXml,
  search: Search,
  target: Target,
  bot: Bot,
  monitor: Monitor,
  chart: ChartNoAxesColumnIncreasing,

  // SEO pillars
  onpage: FileSearch,
  offpage: Link2,
  local: MapPin,
  analytics: Gauge,

  // Ads journey
  spend: Wallet,
  clicks: MousePointerClick,
  bookings: CalendarCheck,
  revenue: TrendingUp,

  // Automation flow
  lead: UserPlus,
  qualify: Sparkles,
  followup: Send,
  booked: CalendarCheck,
  crm: Database,

  // Services (salon & gym)
  cog: Settings,
  globe: Globe,
  megaphone: Megaphone,
  phoneCall: PhoneCall,

  // Case studies
  scissors: Scissors,
  dumbbell: Dumbbell,

  // Careers
  server: Server,
  brush: Brush,
  rocket: Rocket,

  // Misc
  card: CreditCard,
} satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof icons;

export function Icon({
  name,
  size = 24,
  strokeWidth = 2,
  className,
}: {
  name: IconKey;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const Cmp = icons[name];
  return <Cmp size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />;
}
