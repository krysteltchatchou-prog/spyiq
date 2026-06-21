import { StatsGrid }          from "@/components/dashboard/StatsGrid";
import { RevenueChart }        from "@/components/dashboard/RevenueChart";
import { HotProductsCard }     from "@/components/dashboard/HotProductsCard";
import { TrendingNichesCard }  from "@/components/dashboard/TrendingNichesCard";
import { InsightsFeed }        from "@/components/dashboard/InsightsFeed";
import { StoreBuilderWidget }  from "@/components/dashboard/StoreBuilderWidget";
import { TrendingAdsWidget }   from "@/components/dashboard/TrendingAdsWidget";
import { TopAppsWidget }       from "@/components/dashboard/TopAppsWidget";
import { getBoardProducts }    from "@/lib/board-data";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const board = await getBoardProducts();
  const hotProducts = board.slice(0, 5).map((p) => ({
    id: p.product_id,
    emoji: p.emoji,
    name: p.name,
    niche: p.niche,
    daily_sales: Math.round(p.monthly_sales_est / 30),
    iq_score: p.iq_score,
    margin_pct: p.margin_pct,
  }));

  return (
    <div className="space-y-6">
      <StatsGrid />
      <RevenueChart />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HotProductsCard products={hotProducts} />
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
