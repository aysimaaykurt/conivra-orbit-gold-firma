"use client";

import { useState } from "react";
import ProjectCard from "./ProjectCard";
import EvaluationModal from "./EvaluationModal";
import { Project, EvaluationData, mockEvaluation } from "@/src/mocks/projects";

interface ProjectsListProps {
  projects: Project[];
}

export default function ProjectsList({ projects }: ProjectsListProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);

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

  const handleSubmit = (data: EvaluationData) => {
    console.log("Evaluation submitted:", data);
    // TODO: Submit evaluation data
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
          />
        ))}
      </div>

      <EvaluationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        initialData={isViewOnly ? mockEvaluation : undefined}
        isViewOnly={isViewOnly}
      />
    </>
  );
}

