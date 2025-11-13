import { useTranslation } from "react-i18next";

interface PlayerErrorProps {
  message: string;
  icon: React.ReactNode;
}

export function PlayerError({ message, icon }: PlayerErrorProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      {icon}
      <p className="text-lg text-white">{message}</p>
      <div className="flex items-center gap-3">
        <button className="bg-gray-700 rounded-md px-4 py-2 text-white hover:bg-blue-600">
          {t("movie-detail.error.refresh")}
        </button>
        <button className="rounded-md bg-primary-blue px-4 py-2 text-white hover:bg-gray-600">
          {t("movie-detail.error.switch")}
        </button>
      </div>
    </div>
  );
}
