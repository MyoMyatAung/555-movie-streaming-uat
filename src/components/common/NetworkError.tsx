import IconCellularNetwork from "@/assets/svgs/icon-cellular-network.svg?react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface NetworkErrorProps {
    onRefresh?: () => void;
    onSwitchResource?: () => void;
    showSwitchResource?: boolean;
}

export function NetworkError({
    onRefresh,
    onSwitchResource,
    showSwitchResource = true,
}: NetworkErrorProps) {
    const { t } = useTranslation();

    return (
        <div className="flex w-full flex-col items-center justify-center gap-6 p-6">
            {/* Icon */}
            <IconCellularNetwork className="h-10 w-10 opacity-40" />

            {/* Error Text */}
            <div className="text-center">
                <h3 className="text-lg font-medium text-white">
                    {t("movie-detail.error.networkError")}
                </h3>
                <p className="mt-2 text-sm text-white/60">
                    {t("movie-detail.error.networkErrorDescription")}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                {onRefresh && (
                    <Button
                        onClick={onRefresh}
                        variant="secondary"
                        className="min-w-[140px] bg-[#FFFFFF14] text-white"
                    >
                        {t("movie-detail.error.refresh")}
                    </Button>
                )}
                {showSwitchResource && onSwitchResource && (
                    <Button
                        onClick={onSwitchResource}
                        variant="default"
                        className="min-w-[140px]"
                    >
                        {t("movie-detail.error.switch")}
                    </Button>
                )}
            </div>
        </div>
    );
}

