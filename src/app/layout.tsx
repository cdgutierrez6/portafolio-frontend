import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cristian Gutiérrez | Portfolio",
  description: "Senior Full-Stack Software Developer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
