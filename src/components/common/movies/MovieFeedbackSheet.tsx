import SheetModal from "@/components/common/SheetModal";
import { Button } from "@/components/ui/button";
import { mockIssues } from "@/data/mockIssues";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface MovieFeedbackSheetProps {
  openFeedbackSheet: boolean;
  setOpenFeedbackSheet: Dispatch<SetStateAction<boolean>>;
}

export function MovieFeedbackSheet({
  openFeedbackSheet,
  setOpenFeedbackSheet,
}: MovieFeedbackSheetProps) {
  const { t } = useTranslation();
  const [selectedIssue, setSelectedIssue] = useState<string>("");
  const [feedbackDetail, setFeedbackDetail] = useState<string>("");

  const handleIssueSelect = (issue: string) => {
    setSelectedIssue(issue);
  };

  const handleCancel = () => {
    setOpenFeedbackSheet(false);
    setSelectedIssue("");
    setFeedbackDetail("");
  };

  const handleSubmit = () => {
    if (!selectedIssue) {
      return;
    }

    // TODO: Implement feedback submission logic
    console.log("Submitting feedback:", {
      issue: selectedIssue,
      detail: feedbackDetail,
    });

    setOpenFeedbackSheet(false);
    setSelectedIssue("");
    setFeedbackDetail("");
  };

  return (
    <SheetModal
      showModal={openFeedbackSheet}
      setShowModal={setOpenFeedbackSheet}
      title={t("movie-detail.issues.header")}
      onClose={handleCancel}
      containerClassName="!bg-gray-900"
    >
      <div className="flex flex-col gap-6 p-4">
        {/* Issue Selection */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-white">
            {t("movie-detail.issues.title")}
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            {mockIssues.map((issue, index) => (
              <button
                key={index}
                onClick={() => handleIssueSelect(issue)}
                className={`rounded-lg border px-4 py-3 text-sm transition-colors ${
                  selectedIssue === issue
                    ? "border-primary-blue bg-primary-blue text-white"
                    : "border-gray-700 bg-gray-800 text-white hover:border-gray-600"
                }`}
              >
                {issue}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Detail Textarea */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-white">
            {t("movie-detail.issues.description")}{" "}
            <span className="text-gray-500">
              ({t("movie-detail.issues.required")})
            </span>
          </h3>
          <textarea
            value={feedbackDetail}
            onChange={(e) => setFeedbackDetail(e.target.value)}
            placeholder={t("movie-detail.feedback.placeholder")}
            className="focus:border-primary-blue min-h-[120px] rounded-lg border border-gray-700 bg-gray-800 p-3 text-sm text-white placeholder:text-gray-500 focus:outline-none"
            rows={5}
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <Button
            className="bg-primary-blue flex-1 text-white hover:bg-blue-600 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={!selectedIssue}
          >
            {t("movie-detail.actions.submit")}
          </Button>
        </div>
      </div>
    </SheetModal>
  );
}
