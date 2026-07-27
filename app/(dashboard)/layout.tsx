import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { MobileNav } from "@/components/layout/MobileNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div style={{ background: "#f4f2ec", minHeight: "100vh" }}>
      {/* Sidebar — hidden below md breakpoint */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Sticky topbar — offset for sidebar on md+ */}
      <Topbar />

      {/* Page content */}
      <main
        className="md:ml-[240px]"
        style={{ paddingTop: 58, minHeight: "100vh" }}
      >
        {/* 28px gutter, max 1400px, extra bottom pad on mobile for tab bar */}
        <div className="px-7 py-7 pb-24 md:pb-7 max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile tab bar */}
      <MobileNav />
    </div>
  );
}
