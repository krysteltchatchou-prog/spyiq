import { StatsGrid }          from "@/components/dashboard/StatsGrid";
import { RevenueChart }        from "@/components/dashboard/RevenueChart";
import { HotProductsCard }     from "@/components/dashboard/HotProductsCard";
import { TrendingNichesCard }  from "@/components/dashboard/TrendingNichesCard";
import { InsightsFeed }        from "@/components/dashboard/InsightsFeed";
import { StoreBuilderWidget }  from "@/components/dashboard/StoreBuilderWidget";
import { TrendingAdsWidget }   from "@/components/dashboard/TrendingAdsWidget";
import { TopAppsWidget }       from "@/components/dashboard/TopAppsWidget";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <StatsGrid />
      <RevenueChart />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HotProductsCard />
        <TrendingNichesCard />
      </div>
      <InsightsFeed />
      <StoreBuilderWidget />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendingAdsWidget />
        <TopAppsWidget />
      </div>
    </div>
  );
}
