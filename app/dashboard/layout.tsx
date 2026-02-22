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

  const notifCount = await prisma.notification.count({
    where: { userId, lu: false },
  });

  return (
    <div className="min-h-screen bg-[#080808] text-white flex">
      <DashboardSidebar
        user={{
          name: session.user?.name || "",
          email: session.user?.email || "",
          role,
        }}
        notifCount={notifCount}
      />
      <main className="flex-1 lg:ml-64 min-h-screen overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
