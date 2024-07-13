import { FooterItem, NavItem } from "@/types";

export const footerLinks: FooterItem[] = [
    {
        label: "Powered by",
        brand: "justjoin.it.",
        href: "https://justjoin.it",
        title: "justjoin.it homepage",
    },
    {
        label: "Created by",
        brand: "Lukasz Fabia",
        href: "https://lukaszfabia.vercel.app",
        title: "lukasz fabia personal website",
    }
]

export const navItems: NavItem[] = [
    {
        label: "Statistics",
        href: "/statistics",
    },
    {
        label: "Calculator",
        href: "/calculator",
    },
    {
        label: "About",
        href: "/about",
    },
]