import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useLocation } from "react-router-dom"
import { Menu, ShieldCheck, X } from "lucide-react"

import logo from "@/assets/logo.png"
import LanguageSwitcher from "@/components/common/language-switcher"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import useAuthStore from "@/stores/auth-store"

const getInitials = (name?: string | null) => {
  if (!name) {
    return "AD"
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { user } = useAuthStore()
  const { t } = useTranslation("header")

  const sections = [
    { label: t("sections.home"), href: "/" },
    { label: t("sections.programs"), href: "/programs" },
    { label: t("sections.scholarship"), href: "/scholarship" },
    { label: t("sections.admissionConditions"), href: "/admission-conditions" },
    { label: t("sections.admissionProcess"), href: "/admission-process" },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-10">
        <Link to="/" className="shrink-0">
          <img className="h-12 w-auto" src={logo} alt="VinUni AI Admissions" />
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {sections.map((section) => {
            const isActive = location.pathname === section.href

            return (
              <Link
                key={`${section.href}-${section.label}`}
                to={section.href}
                className={cn(
                  "relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150",
                  "text-muted-foreground hover:bg-accent hover:text-foreground",
                  isActive && "bg-accent text-foreground"
                )}
              >
                {section.label}
                {isActive ? (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-primary" />
                ) : null}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {user ? (
            <Link to="/admin" className="hidden md:block">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2 shadow transition-colors hover:border-primary/30 hover:bg-primary/5">
                <Avatar >
                  <AvatarFallback className=" font-semibold ">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="max-w-36 truncate text-sm font-semibold text-slate-950">
                    {user.name}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    <span>{user.role}</span>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <Link to="/login" className="hidden md:block">
              <Button className="cursor-pointer font-medium">
                {t("loginButton")}
              </Button>
            </Link>
          )}

          <button
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={t("toggleMenu")}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="flex flex-col gap-1 border-t border-border/50 bg-background/95 px-6 py-4 backdrop-blur-xl md:hidden">
          {sections.map((section) => {
            const isActive = location.pathname === section.href

            return (
              <Link
                key={`${section.href}-${section.label}`}
                to={section.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  "text-muted-foreground hover:bg-accent hover:text-foreground",
                  isActive && "bg-accent text-foreground"
                )}
              >
                {section.label}
              </Link>
            )
          })}

          <div className="mt-3 border-t border-border/50 pt-3">
            {user ? (
              <Link to="/admin" onClick={() => setMobileOpen(false)}>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
                  <Avatar size="lg" className="bg-slate-950 text-white">
                    <AvatarFallback className="bg-slate-950 font-semibold text-white">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500">{user.role}</p>
                  </div>
                </div>
              </Link>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="w-full cursor-pointer font-medium">
                  {t("loginButton")}
                </Button>
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}

export default Header
