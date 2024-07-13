"use client";

import {
  Navbar as Nav,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { navItems } from "@/config/links";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon } from "@/components/icons";
import { NavItem } from "@/types";
import { FC } from "react";
import { usePathname } from "next/navigation";

const NavbarLinksAndToggler: FC<{ includeMenuToggle: boolean }> = ({ includeMenuToggle }) => {
  return (
    <>
      <Link isExternal aria-label="Github" href={siteConfig.links.github}>
        <GithubIcon className="text-default-500" />
      </Link>
      <ThemeSwitch />
      {includeMenuToggle && <NavbarMenuToggle />}
    </>
  )
}

export const Navbar: FC = () => {
  const path = usePathname();
  const checkPath = (name: string) => {
    return name.toLowerCase() === path.split('/')[1];
  }

  return (
    <Nav maxWidth="xl" shouldHideOnScroll classNames={{
      item: [
        "flex",
        "relative",
        "h-full",
        "items-center",
        "data-[active=true]:after:content-['']",
        "data-[active=true]:after:absolute",
        "data-[active=true]:after:bottom-0",
        "data-[active=true]:after:left-0",
        "data-[active=true]:after:right-0",
        "data-[active=true]:after:h-[2px]",
        "data-[active=true]:after:rounded-[2px]",
        "data-[active=true]:after:bg-foreground",
      ],
    }}>

      {/* main nav links */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <p className={clsx(
              linkStyles({ color: "foreground" }),
              "data-[active=true]:text-primary font-bold",
            )}
              color="foreground">{siteConfig.name}</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {navItems.map((item: NavItem) => (
            <NavbarItem key={item.href} isActive={checkPath(item.label)}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="hidden sm:flex gap-2">
          <NavbarLinksAndToggler includeMenuToggle={false} />
        </NavbarItem>
      </NavbarContent>

      {/* Mobile view */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <NavbarLinksAndToggler includeMenuToggle={true} />
      </NavbarContent>


      {/* menu for mobile */}
      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {navItems.map((item: NavItem, index: number) => (
            <NavbarMenuItem key={index} isActive={checkPath(item.label)}>
              <NextLink
                href={item.href}
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
              >
                {item.label}
              </NextLink>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </Nav>
  );
};
