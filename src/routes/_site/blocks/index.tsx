import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_site/blocks/")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_site/blocks/"!</div>
}
