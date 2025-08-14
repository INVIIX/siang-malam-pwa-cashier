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
import { NotificationSalesOrderBadge } from "@/modules/notification/components/ui/sales-orders-badge"
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
                                <SidebarMenuItem key={item.title} className="overflow-visible">
                                    <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/4">{item.url == '/cashier' && <NotificationSalesOrderBadge />}</div>
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