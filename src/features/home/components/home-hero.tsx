import { GraduationCap, Sparkles } from "lucide-react"

type HomeHighlight = {
  label: string
  value: string
  description: string
}

const highlights: HomeHighlight[] = [
  {
    label: "Phan hoi",
    value: "~30 giay",
    description: "Tra loi nhanh cac cau hoi tuyen sinh pho bien.",
  },
  {
    label: "Noi dung",
    value: "24/7",
    description: "San sang ho tro thong tin chuong trinh, hoc phi va ho so.",
  },
  {
    label: "Tu van",
    value: "1:1",
    description: "Goi y lo trinh hoi dap truoc khi lien he bo phan admissions.",
  },
]

const HomeHero = () => {
  return (
    <div className="flex h-full flex-col justify-between gap-5">
      <div className="space-y-5">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-2 text-sm font-medium text-primary shadow-sm backdrop-blur-sm">
          <Sparkles className="h-4 w-4" />
          Tro ly tu van tuyen sinh thong minh VinUni
        </div>

        <h1 className="max-w-xl text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Chatbox tu van tuyen sinh san sang de ban hoi bat cu dieu gi.
        </h1>

        <div className="grid gap-3 sm:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.35)] backdrop-blur-sm"
            >
              <p className="text-xs font-semibold tracking-[0.24em] text-[#d6ae4e] uppercase">
                {item.label}
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-950">
                {item.value}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200/80 bg-slate-950 p-6 text-white shadow-[0_24px_80px_-36px_rgba(15,23,42,0.7)]">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold tracking-[0.22em] text-primary/90 uppercase">
              San sang de bat dau?
            </p>
            <p className="text-lg font-medium text-white">
              Ban co the hoi ve hoc bong, hoc phi, deadline va quy trinh tuyen sinh cua
              VinUni ngay bay gio.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80">
                Hoc bong
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80">
                Hoc phi
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80">
                Deadline
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeHero
