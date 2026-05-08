import { useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Award, GraduationCap, Loader2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  type ScholarshipPolicy,
  type ScholarshipType,
} from "@/types/scholarship-policy-type"
import { useQuery } from "@tanstack/react-query"
import { getScholarshipPolicies } from "@/api/scholarship-policy-api"

const PAGE_SIZE = 12

const ScholarshipPage = () => {
  const { t } = useTranslation("home")

  const scholarshipTypeLabels: Record<ScholarshipType, string> = {
    MERIT: t("scholarshipMerit"),
    NEED_BASED: t("scholarshipNeedBased"),
    TALENT: t("scholarshipTalent"),
    SPECIAL: t("scholarshipSpecial"),
  }
  const [offset, setOffset] = useState(0)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["public-scholarships", offset],
    queryFn: () => getScholarshipPolicies({ limit: PAGE_SIZE, offset }),
  })

  const scholarships = data?.items ?? []
  const total = data?.total ?? 0
  const hasMore = offset + scholarships.length < total

  const formatValue = (policy: ScholarshipPolicy) => {
    if (!policy.value) return null
    if (policy.value_type === "PERCENTAGE") {
      return `${policy.value}%`
    }
    return `${policy.value.toLocaleString()} VND`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 to-white py-16 dark:from-amber-950/20 dark:to-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
              {t("scholarshipTitle")}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {t("scholarshipSubtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Scholarships Grid */}
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
          ) : scholarships.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/50 py-16 text-center">
              <Award className="mx-auto size-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">{t("noScholarships")}</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {scholarships.map((policy: ScholarshipPolicy) => (
                  <div
                    key={policy.id}
                    className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md dark:shadow-none"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-linear-to-br from-amber-100 to-orange-100 text-amber-700">
                          <Award className="size-6" />
                        </div>
                        <Badge
                          variant="outline"
                          className="rounded-full border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-700"
                        >
                          {scholarshipTypeLabels[policy.type]}
                        </Badge>
                      </div>

                      <h3 className="mt-4 text-lg font-semibold text-foreground">
                        {policy.name}
                      </h3>
                      <p className="mt-1 text-xs tracking-[0.18em] text-muted-foreground uppercase">
                        {policy.year}
                      </p>

                      {policy.value && (
                        <div className="mt-3 text-2xl font-bold text-emerald-600">
                          {formatValue(policy)}
                        </div>
                      )}

                      <div className="mt-4">
                        <p className="text-xs text-muted-foreground">
                          {policy.scope === "GLOBAL"
                            ? t("scopeGlobal")
                            : t("scopeMajorSpecific")}
                        </p>
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
                    {offset + 1}–{offset + scholarships.length} / {total}
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
              to="/programs"
              className="rounded-xl border border-border px-6 py-3 font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted"
            >
              <GraduationCap className="mr-2 inline size-4" />
              {t("viewPrograms")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ScholarshipPage
