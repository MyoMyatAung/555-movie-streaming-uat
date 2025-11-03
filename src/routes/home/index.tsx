import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/home/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  return <div className="text-white">{t("common.hello")} "/home/"!</div>;
}
