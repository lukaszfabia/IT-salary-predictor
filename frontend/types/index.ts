import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface NavItem {
  label: string;
  href: string;
}

export interface FooterItem extends NavItem {
  brand: string;
  title: string;
}

export type Kategory = {
  id: number;
  name: string;
}

export type Handler = {
  key: string;
  dataOnChange: (key: string, value: string) => void;
}


export type Input = {
  city: string;
  technologies: string[];
  experience: string;
  contract: string;
  mode: string;
}