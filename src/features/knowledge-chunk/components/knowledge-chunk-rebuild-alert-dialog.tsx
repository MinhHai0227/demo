import { AlertTriangle, DatabaseZap, Loader2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type KnowledgeChunkRebuildAlertDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void | Promise<void>
  isSubmitting?: boolean
}

const KnowledgeChunkRebuildAlertDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting = false,
}: KnowledgeChunkRebuildAlertDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm gap-0 overflow-hidden rounded-2xl border border-slate-200 p-0">
        {/* Icon header */}
        <div className="flex flex-col items-center gap-3 bg-amber-50 px-6 py-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-full border border-amber-200 bg-white text-amber-600">
            <DatabaseZap className="size-5" />
          </div>
          <AlertDialogHeader className="space-y-1 text-center">
            <AlertDialogTitle className="text-base font-semibold text-slate-900">
              Rebuild missing embeddings?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs leading-relaxed text-slate-500">
              This will process up to 100 active chunks with missing embeddings.
              Press confirm to start the batch rebuild.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        {/* Warning note */}
        <div className="px-5 pt-4">
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
            <p className="text-xs text-amber-800">
              Only chunks with{" "}
              <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-[11px]">
                needs_embedding=true
              </code>{" "}
              will be retried.
            </p>
          </div>
        </div>

        {/* Footer */}
        <AlertDialogFooter className="mt-4 flex flex-row items-center justify-end gap-2 border-t border-slate-100 bg-white px-5 py-4">
          <AlertDialogCancel
            disabled={isSubmitting}
            className="h-9 rounded-xl border-slate-200 text-sm text-slate-600"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isSubmitting}
            onClick={onConfirm}
            className="h-9 rounded-xl bg-amber-500 text-sm hover:bg-amber-600 focus:ring-amber-400"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" /> Rebuilding...
              </>
            ) : (
              <>
                <DatabaseZap className="size-3.5" /> Rebuild
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default KnowledgeChunkRebuildAlertDialog
