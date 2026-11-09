import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "../components/DashboardSidebar"

const dashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="flex min-w-0 flex-1 bg-[#09090B]">
        <div className="shrink-0 pt-4 pl-2 sm:pl-3 lg:pt-6">
          <SidebarTrigger />
        </div>
        <div className="min-w-0 flex-1">{children}</div>
      </main>
    </SidebarProvider>
  )
}

export default dashboardLayout
