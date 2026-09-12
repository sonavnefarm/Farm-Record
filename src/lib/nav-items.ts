import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  PawPrint,
  Wheat,
  Milk,
  Syringe,
  BarChart3,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: { label: string; href: string; icon: LucideIcon }[];
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Animals", href: "/animals", icon: PawPrint },
  {
    label: "Records",
    href: "/records/food",
    icon: Wheat,
    children: [
      { label: "Food", href: "/records/food", icon: Wheat },
      { label: "Milk", href: "/records/milk", icon: Milk },
      { label: "Medicine", href: "/records/medicine", icon: Syringe },
    ],
  },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];
