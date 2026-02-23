import { BottomNav } from "@/components/layout/BottomNav";
import { upsertMe } from "@/lib/api";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await upsertMe();

  return (
    <div className="min-h-dvh bg-brand-bg">
      <main className="mx-auto max-w-lg px-4 pt-6 pb-24">{children}</main>
      <BottomNav />
    </div>
  );
}
