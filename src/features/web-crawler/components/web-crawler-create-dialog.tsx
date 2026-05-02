import { useEffect, useState, type FormEvent } from "react"
import { Globe2, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { CreateCrawlSessionPayload } from "@/types/crawl-type"

type WebCrawlerCreateDialogProps = {
  open: boolean
  isSubmitting?: boolean
  errorMessage?: string | null
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: CreateCrawlSessionPayload) => void
}

const WebCrawlerCreateDialog = ({
  open,
  isSubmitting = false,
  errorMessage,
  onOpenChange,
  onSubmit,
}: WebCrawlerCreateDialogProps) => {
  const [targetUrl, setTargetUrl] = useState("")
  const [limit, setLimit] = useState("100")

  useEffect(() => {
    if (open) return

    const timeoutId = window.setTimeout(() => {
      setTargetUrl("")
      setLimit("100")
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [open])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedLimit = Math.max(1, Math.min(10000, Number(limit || 100)))
    onSubmit({
      target_url: targetUrl.trim(),
      limit: normalizedLimit,
    })
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setTargetUrl("")
      setLimit("100")
    }
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 sm:max-w-lg">
        <DialogHeader className="border-b border-slate-100 bg-linear-to-r from-slate-50 to-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Globe2 className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-slate-900">
                New site crawl
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Discover internal links and turn each page into editable
                markdown.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5">
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel className="text-xs font-medium text-slate-600">
                  Target URL
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="url"
                    required
                    value={targetUrl}
                    placeholder="https://admissions.vinuni.edu.vn"
                    className="h-10 rounded-xl border-slate-200 bg-white text-sm shadow-none"
                    onChange={(event) => setTargetUrl(event.target.value)}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel className="text-xs font-medium text-slate-600">
                  Page limit
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    min={1}
                    max={10000}
                    required
                    value={limit}
                    className="h-10 rounded-xl border-slate-200 bg-white text-sm shadow-none"
                    onChange={(event) => setLimit(event.target.value)}
                  />
                </FieldContent>
              </Field>
            </FieldGroup>

            {errorMessage && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                {errorMessage}
              </div>
            )}
          </div>

          <DialogFooter className="rounded-none border-slate-100 bg-slate-50/60 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-slate-200 text-sm"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl text-sm"
              disabled={isSubmitting || !targetUrl.trim()}
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Globe2 className="size-4" />
              )}
              Start crawl
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default WebCrawlerCreateDialog
