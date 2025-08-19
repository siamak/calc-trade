import { redirect } from "next/navigation";

export default function RootPage() {
	// Redirect to default locale (English)
	redirect("/en");
}
