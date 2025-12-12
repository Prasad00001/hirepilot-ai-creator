import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background flex w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pb-20 lg:pb-0">
          <Outlet />
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
