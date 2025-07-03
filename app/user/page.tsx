import { redirect } from "next/navigation";

export default function UserRedirectPage() {
  redirect("/user/dashboard");
}
