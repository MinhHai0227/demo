import { Link, useLocation } from "react-router-dom"
import {
  BookOpenText,
  CreditCard,
  FileText,
  Globe2,
  GraduationCap,
  LayoutDashboard,
  MessageCircle,
  MessageSquareQuote,
  ShieldCheck,
  Users,
  Scan,
} from "lucide-react"

import logo from "@/assets/logo.png"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

type NavItem = {
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
}

type NavSection = {
  title: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    title: "Tong quan",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
      {
        label: "Hot Questions",
        icon: MessageSquareQuote,
        href: "/admin/hot-questions",
      },
      { label: "Leads", icon: Users, href: "/admin/leads" },
      { label: "Applications", icon: FileText, href: "/admin/applications" },
    ],
  },
  {
    title: "Van hanh tuyen sinh",
    items: [
      {
        label: "Web Crawler",
        icon: Globe2,
        href: "/admin/web-crawler",
      },
      {
        label: "Quick Processing",
        icon: Scan,
        href: "/admin/quick-processing",
      },

      {
        label: "Knowledge Chunks",
        icon: BookOpenText,
        href: "/admin/knowledge-chunks",
      },
    ],
  },
  {
    title: "Noi dung va chinh sach",
    items: [
      { label: "Majors", icon: GraduationCap, href: "/admin/majors" },
      {
        label: "Tuition Policies",
        icon: CreditCard,
        href: "/admin/tuition-policies",
      },
    ],
  },
  {
    title: "Quan tri he thong",
    items: [{ label: "Staffs", icon: ShieldCheck, href: "/admin/staffs" }],
  },
  {
    title: "Chat",
    items: [{ label: "Chat", icon: MessageCircle, href: "/message" }],
  },
]

const AppSidebar = () => {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          to="/admin"
          className="flex items-center gap-3 rounded-xl border border-sidebar-border bg-white/70 px-3 py-2 shadow-sm"
        >
          <img
            className="h-10 w-auto shrink-0"
            src={logo}
            alt="VinUni AI Admissions"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">
              Admissions Admin
            </p>
            <p className="truncate text-xs text-slate-500">
              Quan ly tuyen sinh
            </p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {navSections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href

                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Link to={item.href}>
                        <Icon className="text-sidebar-foreground/80" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar
