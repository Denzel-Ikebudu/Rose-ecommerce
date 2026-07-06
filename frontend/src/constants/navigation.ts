export interface NavItem {
  label: string;
  href: string;
}

export const NAV_LINKS: NavItem[] = [
  { label: "Shop", href: "/shop" },
  { label: "Our Clinic", href: "/about" },
  { label: "Learn", href: "/learn" },
  { label: "Reviews", href: "/reviews" },
];