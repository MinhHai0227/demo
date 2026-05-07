import { useTranslation } from "react-i18next"
import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { ArrowUpRight, Mail, Phone } from "lucide-react"

import logo from "@/assets/logo.png"
import { Separator } from "@/components/ui/separator"
import LanguageSwitcher from "./language-switcher"

const quickLinks = [
  { labelKey: "aboutVinUni", href: "https://vinuni.edu.vn/" },
  { labelKey: "ourCampus", href: "#campus" },
  { labelKey: "newsEvents", href: "#news" },
  { labelKey: "search", href: "#search" },
]

const academicLinks = [
  {
    labelKey: "collegeBusiness",
    href: "https://cbm.vinuni.edu.vn/",
  },
  {
    labelKey: "collegeEngineering",
    href: "https://cecs.vinuni.edu.vn/",
  },
  {
    labelKey: "collegeHealth",
    href: "https://chs.vinuni.edu.vn/",
  },
  {
    labelKey: "collegeArts",
    href: "https://cas.vinuni.edu.vn/",
  },
]

interface ContactLink {
  labelKey: string
  href: string
  icon?: LucideIcon
}

const contactLinks: ContactLink[] = [
  { labelKey: "careersAtVinUni", href: "https://vinuni.edu.vn/careers/" },
  { labelKey: "email", href: "mailto:admissions@vinuni.edu.vn", icon: Mail },
  { labelKey: "phone", href: "tel:18008189", icon: Phone },
]

const NavLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    className="group flex items-center gap-1 text-sm text-slate-500 transition-colors duration-150 hover:text-slate-900"
  >
    <span>{children}</span>
    <ArrowUpRight className="h-3 w-3 -translate-x-1 translate-y-1 opacity-0 transition-all duration-150 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
  </a>
)

const SectionHeading = ({ children }: { children: ReactNode }) => (
  <h2 className="text-[11px] font-semibold tracking-[0.22em] text-[#d6ae4e] uppercase">
    {children}
  </h2>
)

const Footer = () => {
  const { t } = useTranslation("footer")

  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-white text-slate-900">
      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr] lg:px-10">
        <div className="space-y-6">
          <img className="h-12 w-auto" src={logo} alt="VinUni AI Admissions" />
          <div className="space-y-2">
            <p className="text-[11px] font-semibold tracking-[0.26em] text-[#d6ae4e] uppercase">
              VinUniversity Admissions
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-slate-600">
              A modern admissions experience powered by AI, built for the next
              generation of VinUni students.
            </p>
          </div>
        </div>

        <div>
          <SectionHeading>{t("explore")}</SectionHeading>
          <Separator className="my-4 bg-slate-200" />
          <div className="space-y-3">
            {quickLinks.map((item) => (
              <NavLink key={item.labelKey} href={item.href}>
                {t(item.labelKey)}
              </NavLink>
            ))}
          </div>
        </div>

        <div>
          <SectionHeading>{t("academics")}</SectionHeading>
          <Separator className="my-4 bg-slate-200" />
          <div className="space-y-3">
            {academicLinks.map((item) => (
              <NavLink key={item.labelKey} href={item.href}>
                {t(item.labelKey)}
              </NavLink>
            ))}
          </div>
        </div>

        <div>
          <SectionHeading>{t("contact")}</SectionHeading>
          <Separator className="my-4 bg-slate-200" />
          <div className="space-y-4">
            {contactLinks.map((item) => {
              const Icon = item.icon

              return (
                <a
                  key={item.labelKey}
                  href={item.href}
                  className="group flex items-center gap-2.5 text-sm text-slate-500 transition-colors duration-150 hover:text-slate-900"
                >
                  {Icon ? (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#d6ae4e]/30 bg-[#d6ae4e]/10 transition-colors group-hover:bg-[#d6ae4e]/20">
                      <Icon className="h-3.5 w-3.5 text-[#d6ae4e]" />
                    </span>
                  ) : null}
                  <span>{t(item.labelKey)}</span>
                </a>
              )
            })}
          </div>
        </div>
      </div>

      <div className="relative border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div className="flex items-center gap-4">
            <p className="text-xs text-slate-500">
              {t("copyright")}
            </p>
            <LanguageSwitcher />
          </div>
          <p className="text-xs text-slate-400">
            {t("craftedForVinUni")}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
