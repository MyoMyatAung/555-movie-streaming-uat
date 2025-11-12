import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  beforeLoad: async () => {
    return redirect({
      to: "/home",
    });
  },
});
function RouteComponent() {
  return <div className="text-white">Hello world"/"!</div>;
}
