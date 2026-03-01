// app/dashboard/layout.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardSidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const userId = (session.user as any).id;
  const role = (session.user as any).role;
  let notifCount = 0;
  try {
    notifCount = await prisma.notification.count({ where: { userId, lu: false } });
  } catch (e) {}
  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "white", display: "flex" }}>
      <DashboardSidebar user={{ name: session.user?.name || "", email: session.user?.email || "", role }} notifCount={notifCount} />
      <main className="lg:ml-64" style={{ flex: 1, minHeight: "100vh" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
          {children}
        </div>
      </main>
    </div>
  );
}