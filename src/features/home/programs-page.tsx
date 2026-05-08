import { useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { BookType, GraduationCap, Loader2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  majorTypeLabelMap,
  type Major,
  type MajorType,
} from "@/types/major-type"
import { useQuery } from "@tanstack/react-query"
import { getMajors } from "@/api/major-api"

const PAGE_SIZE = 12

const ProgramsPage = () => {
  const { t } = useTranslation("home")
  const { t: tm } = useTranslation("major")
  const [offset, setOffset] = useState(0)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["public-majors", offset],
    queryFn: () => getMajors({ limit: PAGE_SIZE, offset }),
  })

  const majors = data?.items ?? []
  const total = data?.total ?? 0
  const hasMore = offset + majors.length < total

  const getMajorTypeLabel = (type: MajorType) => {
    return tm(majorTypeLabelMap[type]) || type
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 to-white py-16 dark:from-amber-950/20 dark:to-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
              {t("programsTitle")}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {t("programsSubtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-border bg-card p-6"
                >
                  <div className="h-12 w-12 rounded-xl bg-muted" />
                  <div className="mt-4 h-6 w-3/4 rounded bg-muted" />
                  <div className="mt-2 h-4 w-full rounded bg-muted" />
                  <div className="mt-2 h-4 w-2/3 rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : majors.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/50 py-16 text-center">
              <GraduationCap className="mx-auto size-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">{t("noPrograms")}</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {majors.map((major: Major) => (
                  <div
                    key={major.id}
                    className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md dark:shadow-none"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-linear-to-br from-amber-100 to-orange-100 text-amber-700">
                          <GraduationCap className="size-6" />
                        </div>
                        <Badge
                          variant="outline"
                          className="rounded-full border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-700"
                        >
                          <BookType className="mr-1 size-3" />
                          {getMajorTypeLabel(major.major_type)}
                        </Badge>
                      </div>

                      <h3 className="mt-4 text-lg font-semibold text-foreground">
                        {major.name}
                      </h3>
                      <p className="mt-1 text-xs tracking-[0.18em] text-muted-foreground uppercase">
                        {major.code}
                      </p>
                      {major.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                          {major.description}
                        </p>
                      )}

                      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                        {major.credits && <span>{major.credits} {t("credits")}</span>}
                        {major.duration && (
                          <>
                            <span>•</span>
                            <span>{major.duration} {t("years")}</span>
                          </>
                        )}
                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {(offset > 0 || hasMore) && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
                    disabled={offset === 0 || isFetching}
                    className="rounded-xl"
                  >
                    {isFetching && offset > 0 ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : null}
                    {t("prev") || "Previous"}
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {offset + 1}–{offset + majors.length} / {total}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setOffset(offset + PAGE_SIZE)}
                    disabled={!hasMore || isFetching}
                    className="rounded-xl"
                  >
                    {isFetching && hasMore ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : null}
                    {t("next") || "Next"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-foreground py-16">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-10">
          <h2 className="text-2xl font-bold text-primary-foreground">
            {t("readyToApply")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            {t("applyCtaText")}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/login"
              className="rounded-xl bg-[#d6ae4e] px-6 py-3 font-medium text-white transition-colors hover:bg-[#c4a043]"
            >
              {t("applyNow")}
            </Link>
            <Link
              to="/"
              className="rounded-xl border border-border px-6 py-3 font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted"
            >
              {t("contactUs")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProgramsPage
