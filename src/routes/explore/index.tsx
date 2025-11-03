import HomeLayout from "@/components/common/layouts/HomeLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <HomeLayout>
      <div className="text-white">Hello "/explore/"!</div>
    </HomeLayout>
  );
}
