import { Metadata } from "next";
import EcommerceMetricsPage from "@/components/ecommerce/EcommerceMetricsPage"; // your client wrapper

export const metadata: Metadata = {
  title: "Site Clicks Subscription Management Platform",
  description: "For management of the subscription of Site Clicks.",
  icons:{ icon: "/sc-logo.svg"}
};

export default function Dashboard() {
  return <EcommerceMetricsPage />;
}
