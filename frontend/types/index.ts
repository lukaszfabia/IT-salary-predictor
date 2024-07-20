import { SwitchProps } from "@nextui-org/switch";
import { ThemeProviderProps } from "next-themes/dist/types";
import { ReactNode, SVGProps } from "react";

export interface ThemeSwitchProps {
  className?: string;
  classNames?: SwitchProps["classNames"];
}

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Technology = {
  name: string;
  svg: ReactNode;
};

export interface NavItem {
  label: string;
  href: string;
}

export interface Chapter {
  chapter: string;
  anchor: string;
}

export type Kategory = {
  id: number;
  name: string;
};

export type Handler = {
  key: string;
  dataOnChange: (key: string, value: string) => void;
};

export type Input = {
  city: string;
  technologies: string[];
  experience: string;
  contract: string;
  mode: string;
};

export type Step = {
  name: string;
  desc: string;
};

export type Offer = {
  title: string;
  min_b2b: number;
  max_b2b: number;
  min_uop: number;
  max_uop: number;
  technologies: string[];
  locations: string[];
  experience: string;
  operating_mode: string;
};

export interface ChapterComponent {
  chapter: ReactNode;
  key: string;
}
