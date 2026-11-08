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
import { Plus } from "lucide-react"

const menuItemsByRole = {
    seeker: [

    ],

    recruiter: [

    ],

    admin: [

    ]
}

export function DashboardSidebar() {
    const { data: session, isPending } = authClient.useSession();
    const role = session?.user?.role || "seeker";
    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup />
                <SidebarGroup />
                <SidebarGroup>
                    <SidebarMenu>
                        {
                        // menuItemsByRole[role].map((item) => (
                        //     <SidebarMenuItem key={item.id}>
                        //         <SidebarMenuButton render={<a href={item.url} />}>
                        //             <project.icon />
                        //             <span>{item.name}</span>
                        //         </SidebarMenuButton>
                        //     </SidebarMenuItem>
                        // ))
                        }
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}