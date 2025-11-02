"use client";

import React from "react";
import { useFormik } from "formik";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Rating from "@/components/ui/rating";

interface EvaluationFormProps {
  onSubmit: (values: EvaluationFormValues) => void;
  onCancel?: () => void;
  readOnly?: boolean;
  initialValues?: EvaluationFormValues;
}

export interface EvaluationFormValues {
  serviceSatisfaction: number;
  collaborationEffectiveness: number;
  agreementAdherence: "yes" | "no" | "";
  nonComplianceExplanation: string;
  impacts: {
    followerIncrease: boolean;
    similarCollaborations: boolean;
    likeIncrease: boolean;
    viewIncrease: boolean;
  };
}


export default function EvaluationForm({
  onSubmit,
  onCancel,
  readOnly = false,
  initialValues,
}: EvaluationFormProps) {
  const formik = useFormik<EvaluationFormValues>({
    initialValues: initialValues || {
      serviceSatisfaction: 0,
      collaborationEffectiveness: 0,
      agreementAdherence: "",
      nonComplianceExplanation: "",
      impacts: {
        followerIncrease: false,
        similarCollaborations: false,
        likeIncrease: false,
        viewIncrease: false,
      },
    },
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const { values, setFieldValue } = formik;

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Service Satisfaction Rating */}
          <Rating
            value={values.serviceSatisfaction}
            onChange={(value) => setFieldValue("serviceSatisfaction", value)}
            label="Aldığınız Hizmetten Memnun Kaldınız Mı?"
            readOnly={readOnly}
          />

          {/* Agreement Adherence */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <img src="/images/dot.png" alt="" className="w-2 h-2" />
            </div>
            <div className="flex-1">
              <label className="block text-base font-medium text-dark mb-2">
                Influencer Anlaşmanıza Bağlı Kaldı Mı?
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => !readOnly && setFieldValue("agreementAdherence", "yes")}
                  disabled={readOnly}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    readOnly ? "cursor-default" : "cursor-pointer"
                  } ${
                    values.agreementAdherence === "yes"
                      ? "text-white"
                      : "text-primary border-2"
                  }`}
                  style={{
                    backgroundColor:
                      values.agreementAdherence === "yes"
                        ? "#4C226A"
                        : "#E8DAF5",
                    borderColor:
                      values.agreementAdherence === "yes"
                        ? "#4C226A"
                        : "#4C226A",
                    color:
                      values.agreementAdherence === "yes"
                        ? "#FFFFFF"
                        : "#4C226A",
                  }}
                >
                  Evet, Uydu
                </button>
                <button
                  type="button"
                  onClick={() => !readOnly && setFieldValue("agreementAdherence", "no")}
                  disabled={readOnly}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    readOnly ? "cursor-default" : "cursor-pointer"
                  } ${
                    values.agreementAdherence === "no"
                      ? "text-white"
                      : "text-primary border-2"
                  }`}
                  style={{
                    backgroundColor:
                      values.agreementAdherence === "no"
                        ? "#4C226A"
                        : "#E8DAF5",
                    borderColor:
                      values.agreementAdherence === "no" ? "#4C226A" : "#4C226A",
                    color:
                      values.agreementAdherence === "no"
                        ? "#FFFFFF"
                        : "#4C226A",
                  }}
                >
                  Hayır, Uymadı
                </button>
              </div>
            </div>
          </div>

          {/* Non-Compliance Explanation (conditional) */}
          {values.agreementAdherence === "no" && (
            <div>
              <Textarea
                label="Influencer'ın Anlaşmada Bağlı Kalmadığı Maddeleri Açıklayınız."
                value={values.nonComplianceExplanation}
                onChange={(e) =>
                  !readOnly && setFieldValue("nonComplianceExplanation", e.target.value)
                }
                placeholder="Açıklama yazınız..."
                readOnly={readOnly}
              />
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Collaboration Effectiveness Rating */}
          <Rating
            value={values.collaborationEffectiveness}
            onChange={(value) =>
              setFieldValue("collaborationEffectiveness", value)
            }
            label="Influencer İle İş Birliğiniz Ne Kadar Etkili Oldu?"
            readOnly={readOnly}
          />

          {/* Post-Collaboration Impacts */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <img src="/images/dot.png" alt="" className="w-2 h-2" />
            </div>
            <div className="flex-1">
              <label className="block text-base font-medium text-dark mb-3">
                Influencer İle Çalışmanızdan Sonra Etkiler Aşadakilerden Hangileri
                Oldu?
              </label>
              <div className="grid grid-cols-2 gap-2">
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
                ].map((impact) => (
                  <label
                    key={impact.key}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={values.impacts[impact.key]}
                      onChange={(e) =>
                        !readOnly && setFieldValue(`impacts.${impact.key}`, e.target.checked)
                      }
                      disabled={readOnly}
                      className={`w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary ${
                        readOnly ? "cursor-default" : "cursor-pointer"
                      }`}
                      style={{
                        accentColor: "#4C226A",
                      }}
                    />
                    <span className="text-base text-gray-800">
                      {impact.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      {!readOnly && (
        <div className="pt-6 mt-6 border-t border-gray-200">
          <Button
            type="submit"
            className="w-full text-white py-3 rounded-lg"
            style={{ backgroundColor: "#4C226A" }}
          >
            Değerlendir
          </Button>
        </div>
      )}
    </form>
  );
}

