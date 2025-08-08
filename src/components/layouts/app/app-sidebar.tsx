import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { NavUser } from "@/modules/auth/components/ui/nav-user"
import { HomeIcon, ReceiptTextIcon, ShoppingCartIcon } from "lucide-react"
import { NavLink } from "react-router"

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/",
        icon: HomeIcon,
    },
    {
        title: "Penjualan",
        url: "/cashier",
        icon: ShoppingCartIcon,
    },
    {
        title: "Invoices",
        url: "/invoices",
        icon: ReceiptTextIcon,
    },
]

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <NavLink to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="flex items-end jusitfy-end w-full overflow-hidden">
                <SidebarTrigger />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}