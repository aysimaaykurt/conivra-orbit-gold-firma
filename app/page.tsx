import { redirect } from "next/navigation";

export default function Home() {
  // Middleware will handle locale redirect
  redirect("/tr/login");
}
