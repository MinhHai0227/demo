import HomeChatShell from "@/features/home/components/home-chat-shell"
import HomeHero from "@/features/home/components/home-hero"

const HomePage = () => {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(214,174,78,0.18),_transparent_32%),linear-gradient(180deg,_#fffdf7_0%,_#ffffff_48%,_#f8fafc_100%)]">
      <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,_rgba(214,174,78,0.12),_transparent)]" />
      <div className="absolute right-0 bottom-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-6 lg:px-10 lg:py-8">
        <div className="grid gap-6 lg:h-[calc(100dvh-10rem)] lg:grid-cols-[0.9fr_1.25fr] lg:items-stretch">
          <HomeHero />
          <HomeChatShell />
        </div>
      </div>
    </section>
  )
}

export default HomePage
