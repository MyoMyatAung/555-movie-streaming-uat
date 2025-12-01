import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Home, SearchX } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/$")({
  component: NotFoundComponent,
});

function NotFoundComponent() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
      {/* 404 Icon/Number */}
      <div className="mb-6 flex items-center justify-center">
        <div className="relative">
          <SearchX className="size-24 text-white/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-bold text-white/40">404</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <h1 className="mb-3 text-2xl font-semibold text-white">
        {t("common.notFound.title")}
      </h1>

      {/* Description */}
      <p className="mb-8 max-w-sm text-base text-white/60">
        {t("common.notFound.description")}
      </p>

      {/* Go Home Button */}
      <Link to="/home">
        <Button className="glassmorphism-primary-blue hover:bg-primary-blue/90 rounded-full px-6 py-3 text-base font-medium text-white">
          <Home className="mr-2 size-5" />
          {t("common.notFound.goHome")}
        </Button>
      </Link>
    </div>
  );
}
