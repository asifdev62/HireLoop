"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import {
  Bookmark,
  Briefcase,
  Building2,
  CreditCard,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react"

type DashboardRole = "seeker" | "recruiter" | "admin"

type MenuItem = {
  id: string
  name: string
  url: string
  icon: LucideIcon
}

const menuItemsByRole: Record<DashboardRole, MenuItem[]> = {
  seeker: [
    {
      id: "seeker-dashboard",
      name: "Dashboard",
      url: "/dashboard/seeker",
      icon: LayoutDashboard,
    },
    {
      id: "seeker-jobs",
      name: "Jobs",
      url: "/jobs",
      icon: Briefcase,
    },
    {
      id: "seeker-saved-jobs",
      name: "Saved Jobs",
      url: "/dashboard/seeker/saved-jobs",
      icon: Bookmark,
    },
    {
      id: "seeker-applications",
      name: "Applications",
      url: "/dashboard/seeker/applications",
      icon: FileText,
    },
    {
      id: "seeker-billing",
      name: "Billing",
      url: "/dashboard/seeker/billing",
      icon: CreditCard,
    },
    {
      id: "seeker-settings",
      name: "Settings",
      url: "/dashboard/seeker/settings",
      icon: Settings,
    },
  ],

  recruiter: [
    {
      id: "recruiter-dashboard",
      name: "Dashboard",
      url: "/dashboard/recruiter",
      icon: LayoutDashboard,
    },
    {
      id: "recruiter-jobs",
      name: "Jobs",
      url: "/dashboard/recruiter/jobs",
      icon: Briefcase,
    },
    {
      id: "recruiter-applicants",
      name: "Applicants",
      url: "/dashboard/recruiter/applicants",
      icon: Users,
    },
    {
      id: "recruiter-company",
      name: "Company Profile",
      url: "/dashboard/recruiter/company",
      icon: Building2,
    },
    {
      id: "recruiter-billing",
      name: "Billing",
      url: "/dashboard/recruiter/billing",
      icon: CreditCard,
    },
    {
      id: "recruiter-settings",
      name: "Settings",
      url: "/dashboard/recruiter/settings",
      icon: Settings,
    },
  ],

  admin: [
    {
      id: "admin-dashboard",
      name: "Dashboard",
      url: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      id: "admin-jobs",
      name: "Jobs",
      url: "/dashboard/admin/jobs",
      icon: Briefcase,
    },
    {
      id: "admin-users",
      name: "Users",
      url: "/dashboard/admin/users",
      icon: Users,
    },
    {
      id: "admin-companies",
      name: "Companies",
      url: "/dashboard/admin/companies",
      icon: Building2,
    },
    {
      id: "admin-billing",
      name: "Billing",
      url: "/dashboard/admin/billing",
      icon: CreditCard,
    },
    {
      id: "admin-settings",
      name: "Settings",
      url: "/dashboard/admin/settings",
      icon: Settings,
    },
  ],
}

export function DashboardSidebar() {
  const { data: session } = authClient.useSession()
  const pathname = usePathname()
  const role = (session?.user?.role as DashboardRole | undefined) ?? "seeker"
  const menuItems = menuItemsByRole[role] ?? menuItemsByRole.seeker

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => {
              const Icon = item.icon

              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={pathname === item.url}
                    render={<a href={item.url} />}
                  >
                    <Icon />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
