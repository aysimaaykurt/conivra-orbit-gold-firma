"use client";

import { useState } from "react";
import { EvaluationData } from "@/src/mocks/projects";

interface EvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: EvaluationData) => void;
  initialData?: EvaluationData;
  isViewOnly?: boolean;
}

export default function EvaluationModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isViewOnly = false,
}: EvaluationModalProps) {
  const [serviceSatisfaction, setServiceSatisfaction] = useState(
    initialData?.serviceSatisfaction || 0
  );
  const [collaborationEffectiveness, setCollaborationEffectiveness] = useState(
    initialData?.collaborationEffectiveness || 0
  );
  const [agreementAdherence, setAgreementAdherence] = useState<
    "yes" | "no" | null
  >(initialData?.agreementAdherence || null);
  const [agreementExplanation, setAgreementExplanation] = useState(
    initialData?.agreementExplanation || ""
  );
  const [effects, setEffects] = useState({
    followerIncrease: initialData?.effects.followerIncrease || false,
    similarCollaborations: initialData?.effects.similarCollaborations || false,
    likeIncrease: initialData?.effects.likeIncrease || false,
    viewIncrease: initialData?.effects.viewIncrease || false,
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        serviceSatisfaction,
        collaborationEffectiveness,
        agreementAdherence,
        agreementExplanation,
        effects,
      });
    }
    onClose();
  };

  const StarRating = ({
    rating,
    onRatingChange,
    disabled = false,
  }: {
    rating: number;
    onRatingChange: (rating: number) => void;
    disabled?: boolean;
  }) => (
    <div className="flex items-center gap-2">
      <span className="text-base text-gray-600">1-</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !disabled && onRatingChange(star)}
            disabled={disabled}
            className={disabled ? "cursor-default" : "cursor-pointer"}
          >
            <i
              className={`pi ${
                star <= rating ? "pi-star-fill" : "pi-star"
              } text-2xl`}
              style={{
                color: star <= rating ? "#4C226A" : "#D1D5DB",
              }}
            />
          </button>
        ))}
      </div>
      <span className="text-base text-gray-600">-5</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold" style={{ color: "#4C226A" }}>
            Değerlendirme
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="pi pi-times text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
          {/* Question 1 */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <img src="/images/dot.png" alt="" className="w-2 h-2" />
            </div>
            <div className="flex-1">
              <p className="text-base font-medium text-dark mb-3">
                Aldığınız Hizmetten Memnun Kaldınız Mı?
              </p>
              <StarRating
                rating={serviceSatisfaction}
                onRatingChange={setServiceSatisfaction}
                disabled={isViewOnly}
              />
            </div>
          </div>

          {/* Question 2 */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <img src="/images/dot.png" alt="" className="w-2 h-2" />
            </div>
            <div className="flex-1">
              <p className="text-base font-medium text-dark mb-3">
                Influencer İle İş Birliğiniz Ne Kadar Etkili Oldu?
              </p>
              <StarRating
                rating={collaborationEffectiveness}
                onRatingChange={setCollaborationEffectiveness}
                disabled={isViewOnly}
              />
            </div>
          </div>

          {/* Question 3 */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <img src="/images/dot.png" alt="" className="w-2 h-2" />
            </div>
            <div className="flex-1">
              <p className="text-base font-medium text-dark mb-3">
                Influencer Anlaşmanıza Bağlı Kaldı Mı?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    !isViewOnly && setAgreementAdherence("yes")
                  }
                  disabled={isViewOnly}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isViewOnly ? "cursor-default" : "cursor-pointer"
                  }`}
                  style={{
                    backgroundColor:
                      agreementAdherence === "yes"
                        ? "#4C226A"
                        : "#E8DAF5",
                    color:
                      agreementAdherence === "yes"
                        ? "#FFFFFF"
                        : "#4C226A",
                  }}
                >
                  Evet, Uydu
                </button>
                <button
                  type="button"
                  onClick={() => !isViewOnly && setAgreementAdherence("no")}
                  disabled={isViewOnly}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isViewOnly ? "cursor-default" : "cursor-pointer"
                  }`}
                  style={{
                    backgroundColor:
                      agreementAdherence === "no"
                        ? "#4C226A"
                        : "#E8DAF5",
                    color:
                      agreementAdherence === "no"
                        ? "#FFFFFF"
                        : "#4C226A",
                  }}
                >
                  Hayır, Uymadı
                </button>
              </div>
              {/* Explanation */}
              {agreementAdherence === "no" && (
                <div className="mt-3">
                  <textarea
                    value={agreementExplanation}
                    onChange={(e) =>
                      !isViewOnly && setAgreementExplanation(e.target.value)
                    }
                    disabled={isViewOnly}
                    placeholder="Influencer'ın Anlaşmada Bağlı Kalmadığı Maddeleri Açıklayınız."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none bg-white"
                    rows={4}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Question 4 */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <img src="/images/dot.png" alt="" className="w-2 h-2" />
            </div>
            <div className="flex-1">
              <p className="text-base font-medium text-dark mb-3">
                Influencer İle Çalışmanızdan Sonra Etkiler Aşadakilerden
                Hangileri Oldu?
              </p>
              <div className="space-y-2">
                {[
                  {
                    key: "followerIncrease" as const,
                    label: "Takipçi Sayısı Arttı",
                  },
                  {
                    key: "similarCollaborations" as const,
                    label: "Benzer İş Birlikleri Aldı",
                  },
                  {
                    key: "likeIncrease" as const,
                    label: "Beğeni Sayısı Arttı",
                  },
                  {
                    key: "viewIncrease" as const,
                    label: "İzlenme Sayısı Arttı",
                  },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={effects[key]}
                      onChange={(e) =>
                        !isViewOnly &&
                        setEffects({ ...effects, [key]: e.target.checked })
                      }
                      disabled={isViewOnly}
                      className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      style={{ accentColor: "#4C226A" }}
                    />
                    <span className="text-base text-dark">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Footer */}
        {!isViewOnly && (
          <div className="p-6 border-t border-gray-200 flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#4C226A" }}
            >
              Değerlendir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

