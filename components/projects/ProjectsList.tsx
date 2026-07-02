"use client";

import { useState } from "react";
import ProjectCard from "./ProjectCard";
import EvaluationModal from "./EvaluationModal";
import { Project, EvaluationData, mockEvaluation } from "@/src/mocks/projects";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

interface ProjectsListProps {
  projects: Project[];
  onRefresh?: () => void;
}

export default function ProjectsList({ projects, onRefresh }: ProjectsListProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  
  const router = useRouter();
  const locale = useLocale();

  const handleEvaluateClick = (project: Project) => {
    setSelectedProject(project);
    setIsViewOnly(project.overlayAction === "view");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    setIsViewOnly(false);
  };

  const handleCardClick = (project: Project) => {
    let category = "ilan";
    if (project.type === "workshop") category = "workshop";
    if (project.type === "giftkit" || project.type === "hediye_kiti") category = "hediye_kiti";
    
    router.push(`/${locale}/ad-management/detail/${category}/${project.id}`);
  };

  const handleSubmit = (data: EvaluationData) => {
    console.log("Evaluation submitted:", data);
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <>
      <div className="space-y-4">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            colorIndex={index}
            onEvaluateClick={() => handleEvaluateClick(project)}
            onClick={() => handleCardClick(project)}
          />
        ))}
      </div>

      <EvaluationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        initialData={isViewOnly ? mockEvaluation : undefined}
        isViewOnly={isViewOnly}
        applicationId={selectedProject?.applicationId || selectedProject?.id}
        influencerId={selectedProject?.influencerId || selectedProject?.id}
        evaluationId={selectedProject?.evaluationId}
      />
    </>
  );
}

