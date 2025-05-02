"use client";

import React, { useEffect, useState } from "react";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import { fetchDashboardMetrics } from "@/lib/api";

export default function EcommerceMetricsPage() {
  const [metrics, setMetrics] = useState({
    clientsOnSubscription: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    monthlyNewSubscriptions: Array(12).fill(0),
  });

  useEffect(() => {
    async function loadMetrics() {
      const data = await fetchDashboardMetrics();
      setMetrics(data);
    }
    loadMetrics();
  }, []);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics metrics={metrics} />
      </div>
    </div>
  );
}
