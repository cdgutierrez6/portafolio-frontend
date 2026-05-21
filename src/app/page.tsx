import { redirect } from "next/navigation";

// Fallback: el middleware detecta el idioma antes de llegar aquí.
// Si por algún motivo el middleware no actúa, redirige a español.
export default function RootPage() {
  redirect("/es");
}
