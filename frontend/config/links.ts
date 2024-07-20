import { Chapter, NavItem } from "@/types";

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
];

export const aboutChapers: Chapter[] = [
  {
    chapter: "Introduction",
    anchor: "introduction",
  },
  {
    chapter: "Motivations",
    anchor: "motivations",
  },
  {
    chapter: "Collecting data",
    anchor: "collecting-data",
  },
  {
    chapter: "Data model",
    anchor: "data-model",
  },
  {
    chapter: "Solution",
    anchor: "solution",
  },
];

export const statsChapers: Chapter[] = [
  {
    chapter: "Salary Distributions",
    anchor: "salary-distributions",
  },
  {
    chapter: "How do you work in IT and who are employers looking for?",
    anchor: "work-and-exp",
  },
  {
    chapter: "Most popular technologies in Poland",
    anchor: "popular-technologies",
  },
  {
    chapter: "Programmers friendly cities",
    anchor: "popular-cities",
  },
  {
    chapter: "Results for my choosen models",
    anchor: "models-results",
  },
  {
    chapter: "Few conclusions",
    anchor: "conclusions",
  },
];

export const encoders: any = {
  labelencoder: {
    name: "LabelEncoder",
    link: "https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.LabelEncoder.html",
  },
  multilabel: {
    name: "MultiLabelBinarizer",
    link: "https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MultiLabelBinarizer.html",
  },
};
