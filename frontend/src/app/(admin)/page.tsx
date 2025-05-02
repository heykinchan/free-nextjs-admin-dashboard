import { Metadata } from "next";
import EcommerceMetricsPage from "@/components/ecommerce/EcommerceMetricsPage"; // your client wrapper

export const metadata: Metadata = {
  title: "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Dashboard() {
  return <EcommerceMetricsPage />;
}
