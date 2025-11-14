import SheetModal from "@/components/common/SheetModal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { mockDownloadEpisode, type Episode } from "@/data/mockDownloadEpisode";
import { useTranslation } from "react-i18next";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

interface MovieDownloadSheetProps {
  openDownloadSheet: boolean;
  setOpenDownloadSheet: Dispatch<SetStateAction<boolean>>;
}

export function MovieDownloadSheet({
  openDownloadSheet,
  setOpenDownloadSheet,
}: MovieDownloadSheetProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedEpisodes, setSelectedEpisodes] = useState<Set<string>>(
    new Set(),
  );

  const handleEpisodeToggle = (episodeTitle: string) => {
    setSelectedEpisodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(episodeTitle)) {
        newSet.delete(episodeTitle);
      } else {
        newSet.add(episodeTitle);
      }
      return newSet;
    });
  };

  const handleCancel = () => {
    setOpenDownloadSheet(false);
    setSelectedEpisodes(new Set());
  };

  const handleDownload = () => {
    // TODO: Implement download logic
    console.log("Downloading episodes:", Array.from(selectedEpisodes));
    setOpenDownloadSheet(false);
    setSelectedEpisodes(new Set());
  };

  const handleSelectAll = () => {
    const currentPackEpisodes = mockDownloadEpisode[activeTab].episodes;
    const allCurrentTitles = new Set(
      currentPackEpisodes.map((ep) => ep.title),
    );
    const allSelected = currentPackEpisodes.every((ep) =>
      selectedEpisodes.has(ep.title),
    );

    setSelectedEpisodes((prev) => {
      const newSet = new Set(prev);
      if (allSelected) {
        // Deselect all from current pack
        allCurrentTitles.forEach((title) => newSet.delete(title));
      } else {
        // Select all from current pack
        allCurrentTitles.forEach((title) => newSet.add(title));
      }
      return newSet;
    });
  };

  const isAllSelected = mockDownloadEpisode[activeTab].episodes.every((ep) =>
    selectedEpisodes.has(ep.title),
  );

  return (
    <SheetModal
      showModal={openDownloadSheet}
      setShowModal={setOpenDownloadSheet}
      title={t("movie-detail.info.downloadSeries")}
      onClose={handleCancel}
      containerClassName="!bg-gray-900"
    >
      <div className="flex h-[60vh] flex-col">
        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          {mockDownloadEpisode.map((pack, index) => (
            <div
              key={index}
              className={`relative cursor-pointer px-4 py-3 ${
                activeTab === index ? "text-white" : "text-gray-400"
              }`}
              onClick={() => setActiveTab(index)}
            >
              <span className="text-sm">{pack.packTitle}</span>
              {activeTab === index && (
                <div className="bg-primary-blue absolute bottom-0 left-1/2 h-1 w-8 -translate-x-1/2 rounded-md"></div>
              )}
            </div>
          ))}
        </div>

        {/* Episode Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            {mockDownloadEpisode[activeTab].episodes.map(
              (episode: Episode, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 p-3"
                  onClick={() => handleEpisodeToggle(episode.title)}
                >
                  <Checkbox
                    checked={selectedEpisodes.has(episode.title)}
                    onCheckedChange={() => handleEpisodeToggle(episode.title)}
                    className="border-gray-500 data-[state=checked]:border-primary-blue data-[state=checked]:bg-primary-blue"
                  />
                  <span className="text-sm text-white">{episode.title}</span>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Select All Checkbox */}
        <div className="border-t border-gray-700 bg-gray-900 px-4 pt-2">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={handleSelectAll}
          >
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
              className="border-gray-500 data-[state=checked]:border-primary-blue data-[state=checked]:bg-primary-blue"
            />
            <span className="text-sm text-white">
              {t("movie-detail.actions.selectAll")}
            </span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="sticky bottom-0 flex gap-3 bg-gray-900 p-4 pb-2">
          <Button
            variant="outline"
            className="flex-1 border-gray-600 bg-transparent text-white hover:bg-gray-800"
            onClick={handleCancel}
          >
            {t("movie-detail.actions.cancel")}
          </Button>
          <Button
            className="bg-primary-blue flex-1 text-white hover:bg-blue-600"
            onClick={handleDownload}
            disabled={selectedEpisodes.size === 0}
          >
            {t("movie-detail.actions.download")} {selectedEpisodes.size > 0 ? selectedEpisodes.size : ""}
          </Button>
        </div>
      </div>
    </SheetModal>
  );
}
