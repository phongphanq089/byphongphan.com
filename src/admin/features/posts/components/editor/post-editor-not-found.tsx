import { Link } from "@tanstack/react-router"
import { ArrowLeft, FileText } from "lucide-react"

import { AdminContentCard, AdminPageHeader } from "@/admin"
import { Button } from "@/shared/ui"

interface PostEditorNotFoundProps {
  postId?: string
}

export function PostEditorNotFound({ postId }: PostEditorNotFoundProps) {
  return (
    <div className="flex min-h-[calc(100svh-8.5rem)] flex-1 flex-col gap-5">
      <AdminPageHeader
        title="Article Not Found"
        description={`No article matched ID "${postId ?? ""}" in the current workspace.`}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Content & Blog" },
          { label: "Posts", href: "/admin/posts" },
          { label: "Not Found" },
        ]}
      />
      <AdminContentCard variant="dashed" centered>
        <div className="flex size-14 items-center justify-center rounded-full bg-muted/60">
          <FileText className="size-7 text-muted-foreground/70" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">
          Article does not exist
        </h3>
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          The requested article ID could not be found in the mock dataset.
        </p>
        <Button asChild className="mt-6 gap-2">
          <Link to="/admin/posts">
            <ArrowLeft className="size-4" />
            <span>Back to Posts</span>
          </Link>
        </Button>
      </AdminContentCard>
    </div>
  )
}
