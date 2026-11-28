import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  Trash2,
} from "lucide-react"
import * as React from "react"

import { cn } from "@/shared/lib/utils"
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Input,
} from "@/shared/ui"

export type AdminConfirmVariant = "destructive" | "warning" | "default" | "info"

export interface AdminConfirmOptions {
  /**
   * Main title of the confirmation dialog.
   */
  title: React.ReactNode
  /**
   * Detailed explanation or description of the action and consequences.
   */
  description?: React.ReactNode
  /**
   * Visual intent variant:
   * - "destructive": Red palette with trash/alert icon for permanent deletion.
   * - "warning": Amber palette with alert icon for discard or unpublish actions.
   * - "default": Primary palette with check icon for standard confirmations.
   * - "info": Blue palette with info icon for restore, sync, or info actions.
   * @default "destructive"
   */
  variant?: AdminConfirmVariant
  /**
   * Label for the primary confirm button.
   * @default "Delete" (destructive) | "Confirm"
   */
  confirmText?: string
  /**
   * Label for the cancel button.
   * @default "Cancel"
   */
  cancelText?: string
  /**
   * Exact text the user must type to unlock the confirm button (e.g. "DELETE" or item title).
   * Highly recommended for high-risk destructive actions.
   */
  verificationText?: string
  /**
   * Custom label for the verification input prompt.
   */
  verificationLabel?: React.ReactNode
  /**
   * Optional warning callout banner displayed below description.
   */
  warningNote?: React.ReactNode
  /**
   * Custom icon element to replace the variant default icon.
   */
  icon?: React.ReactNode
  /**
   * Callback fired when confirm button is clicked.
   * Supports returning a Promise to automatically display loading state.
   */
  onConfirm?: () => void | Promise<void>
  /**
   * Callback fired when the dialog is dismissed or cancel button is clicked.
   */
  onCancel?: () => void
  /**
   * Whether the action is currently executing (locks buttons and displays spinner).
   * Useful when binding directly to TanStack Query's `mutation.isPending`.
   */
  isLoading?: boolean
}

export interface AdminConfirmDialogProps extends AdminConfirmOptions {
  /**
   * Controlled open state.
   */
  open?: boolean
  /**
   * Callback fired when open state changes.
   */
  onOpenChange?: (open: boolean) => void
  /**
   * Optional trigger element that opens the dialog.
   */
  trigger?: React.ReactElement
  /**
   * Custom className for the DialogContent popup.
   */
  className?: string
}

const variantStyles: Record<
  AdminConfirmVariant,
  {
    iconBadge: string
    defaultIcon: React.ReactNode
    confirmButton: string
    defaultConfirmText: string
    warningBox: string
  }
> = {
  destructive: {
    iconBadge:
      "bg-destructive/10 text-destructive border-destructive/20 dark:bg-destructive/15 dark:border-destructive/30",
    defaultIcon: <Trash2 className="size-5" />,
    confirmButton:
      "bg-destructive text-white hover:bg-destructive/90 shadow-xs shadow-destructive/20 focus-visible:ring-destructive/30",
    defaultConfirmText: "Delete",
    warningBox:
      "bg-destructive/5 text-destructive border-destructive/20 dark:bg-destructive/10",
  },
  warning: {
    iconBadge:
      "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30",
    defaultIcon: <AlertTriangle className="size-5" />,
    confirmButton:
      "bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 shadow-xs shadow-amber-500/20 focus-visible:ring-amber-500/30",
    defaultConfirmText: "Confirm",
    warningBox:
      "bg-amber-500/5 text-amber-700 border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300",
  },
  default: {
    iconBadge:
      "bg-primary/10 text-primary border-primary/20 dark:bg-primary/15 dark:border-primary/30",
    defaultIcon: <CheckCircle2 className="size-5" />,
    confirmButton:
      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs",
    defaultConfirmText: "Confirm",
    warningBox: "bg-muted/50 text-muted-foreground border-border/70",
  },
  info: {
    iconBadge:
      "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30",
    defaultIcon: <Info className="size-5" />,
    confirmButton:
      "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-xs shadow-blue-500/20 focus-visible:ring-blue-500/30",
    defaultConfirmText: "Proceed",
    warningBox:
      "bg-blue-500/5 text-blue-700 border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300",
  },
}

export function AdminConfirmDialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  variant = "destructive",
  confirmText,
  cancelText = "Cancel",
  verificationText,
  verificationLabel,
  warningNote,
  icon,
  isLoading,
  onConfirm,
  onCancel,
  className,
}: AdminConfirmDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isControlled = open !== undefined
  const currentOpen = isControlled ? open : uncontrolledOpen

  const [typedValue, setTypedValue] = React.useState("")
  const [internalLoading, setInternalLoading] = React.useState(false)
  const effectiveLoading = isLoading ?? internalLoading

  const handleOpenChange = (nextOpen: boolean) => {
    if (effectiveLoading && !nextOpen) {
      // Prevent closing while performing action
      return
    }
    if (!nextOpen) {
      setTypedValue("")
      setInternalLoading(false)
      onCancel?.()
    }
    if (!isControlled) {
      setUncontrolledOpen(nextOpen)
    }
    onOpenChange?.(nextOpen)
  }

  const isVerificationRequired = Boolean(verificationText)
  const isVerificationSatisfied =
    !isVerificationRequired || typedValue.trim() === verificationText?.trim()

  const handleConfirmClick = async () => {
    if (!isVerificationSatisfied || effectiveLoading) return

    if (!onConfirm) {
      handleOpenChange(false)
      return
    }

    try {
      const result = onConfirm()
      if (result instanceof Promise) {
        setInternalLoading(true)
        await result
        setInternalLoading(false)
      }
      handleOpenChange(false)
    } catch (error) {
      setInternalLoading(false)
      // Allow caller's error handling to receive the error
      throw error
    }
  }

  const handleCancelClick = () => {
    if (effectiveLoading) return
    handleOpenChange(false)
  }

  const styles = variantStyles[variant]

  return (
    <Dialog open={currentOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent
        showCloseButton={!effectiveLoading}
        onInteractOutside={(e) => {
          if (effectiveLoading) e.preventDefault()
        }}
        onEscapeKeyDown={(e) => {
          if (effectiveLoading) e.preventDefault()
        }}
        className={cn(
          "max-w-md gap-0 overflow-hidden rounded-2xl border border-border/80 bg-background p-0 shadow-2xl",
          className
        )}
      >
        <div className="p-6">
          <div className="flex items-start gap-3.5">
            {/* Visual Icon Badge */}
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl border shadow-xs transition-colors",
                styles.iconBadge
              )}
            >
              {icon ?? styles.defaultIcon}
            </div>

            {/* Title & Description */}
            <div className="flex-1 space-y-1.5 pt-0.5">
              <DialogTitle className="text-base font-semibold text-foreground">
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className="text-xs leading-relaxed text-muted-foreground">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>

          {/* Optional Warning Note Box */}
          {warningNote && (
            <div
              className={cn(
                "mt-4 rounded-xl border p-3 text-xs leading-relaxed",
                styles.warningBox
              )}
            >
              {warningNote}
            </div>
          )}

          {/* Optional Verification Input */}
          {isVerificationRequired && (
            <div className="mt-4 space-y-2">
              <label className="block text-xs font-medium text-foreground">
                {verificationLabel ?? (
                  <span>
                    Type{" "}
                    <code className="rounded border border-border bg-muted/70 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-foreground">
                      {verificationText}
                    </code>{" "}
                    to confirm:
                  </span>
                )}
              </label>
              <Input
                value={typedValue}
                onChange={(e) => setTypedValue(e.target.value)}
                disabled={effectiveLoading}
                placeholder={verificationText}
                className="font-mono text-xs"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isVerificationSatisfied) {
                    e.preventDefault()
                    void handleConfirmClick()
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border/70 bg-muted/30 px-6 py-3.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancelClick}
            disabled={effectiveLoading}
            className="rounded-lg text-xs"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => void handleConfirmClick()}
            disabled={effectiveLoading || !isVerificationSatisfied}
            className={cn(
              "rounded-lg text-xs font-medium transition-all",
              styles.confirmButton
            )}
          >
            {effectiveLoading && (
              <Loader2 className="mr-1.5 size-3.5 animate-spin" />
            )}
            <span>{confirmText ?? styles.defaultConfirmText}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Convenient hook that triggers an admin confirmation dialog via Promise.
 * Ideal for data tables, list actions, and context menus without managing manual modal states.
 *
 * @example
 * ```tsx
 * const { confirm, ConfirmDialog } = useAdminConfirm()
 *
 * const handleDelete = async (postId: string) => {
 *   const isConfirmed = await confirm({
 *     title: "Delete Blog Post?",
 *     description: "This will permanently remove the post and all associated media.",
 *     variant: "destructive",
 *     confirmText: "Delete Post",
 *     verificationText: "DELETE",
 *   })
 *
 *   if (!isConfirmed) return
 *   await deletePostMutation.mutateAsync(postId)
 * }
 *
 * return (
 *   <>
 *     <Button onClick={() => handleDelete("1")}>Delete</Button>
 *     <ConfirmDialog />
 *   </>
 * )
 * ```
 */
export function useAdminConfirm() {
  const [state, setState] = React.useState<
    (AdminConfirmOptions & { open: boolean }) | null
  >(null)
  const resolverRef = React.useRef<((value: boolean) => void) | null>(null)

  const confirm = React.useCallback(
    (options: AdminConfirmOptions): Promise<boolean> => {
      return new Promise<boolean>((resolve) => {
        resolverRef.current = resolve
        setState({
          ...options,
          open: true,
        })
      })
    },
    []
  )

  const handleClose = React.useCallback(() => {
    setState((prev) => (prev ? { ...prev, open: false } : null))
    if (resolverRef.current) {
      resolverRef.current(false)
      resolverRef.current = null
    }
  }, [])

  const handleConfirm = React.useCallback(async () => {
    if (state?.onConfirm) {
      await state.onConfirm()
    }
    if (resolverRef.current) {
      resolverRef.current(true)
      resolverRef.current = null
    }
    setState((prev) => (prev ? { ...prev, open: false } : null))
  }, [state])

  const ConfirmDialogComponent = React.useCallback(() => {
    if (!state) return null
    return (
      <AdminConfirmDialog
        {...state}
        open={state.open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) handleClose()
        }}
        onConfirm={handleConfirm}
        onCancel={handleClose}
      />
    )
  }, [state, handleClose, handleConfirm])

  return {
    confirm,
    ConfirmDialog: ConfirmDialogComponent,
  }
}

export default AdminConfirmDialog
