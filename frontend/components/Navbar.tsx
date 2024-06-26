"use client";

import { useState } from "react";
import { Bars3Icon, XMarkIcon, HomeIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

const navigation = [
  { name: "Docs", href: "/docs" },
  { name: "Statistics", href: "/stats" },
  { name: "Calculate", href: "/calculate" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Lukasz Fabia</span>
            {/* <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt=""
            /> */}
            <Image
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Tailwind UI Mark"
              width={32}
              height={32}
            />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-300"
            >
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="/" className="text-gray-300 text-sm font-semibold leading-6">
            <HomeIcon className="h-6 w-6" aria-hidden="true" />
          </a>
        </div>
      </nav>
    </header>
  );
}
