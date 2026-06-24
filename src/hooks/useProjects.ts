import { useState, useEffect } from 'react';
import { getProjectsList } from '../api/projects/projects.service';
import type { ProjectItem, GetProjectsParams } from '../api/projects/projects.models';
import { Project, ProjectStatus, OverlayAction } from '../mocks/projects';

export const useProjects = (filters?: GetProjectsParams) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getProjectsList(filters);
        
        if (mounted) {
          if (response.success || response.data) {
            // Handle different possible backend response structures
            let dataArray: ProjectItem[] = [];
            
            if (Array.isArray(response.data)) {
              dataArray = response.data;
            } else if (response.data && Array.isArray(response.data.items)) {
              dataArray = response.data.items;
            } else if (response.data && Array.isArray(response.data.data)) {
              dataArray = response.data.data;
            } else if (Array.isArray(response)) {
              dataArray = response as any;
            } else if ((response as any).items && Array.isArray((response as any).items)) {
              dataArray = (response as any).items;
            } else if (response.data) {
              dataArray = response.data as any;
            }
            
            // Map backend model to frontend Project interface
            const mappedProjects: Project[] = dataArray.map((item: any) => {
              // Extract status and map to frontend ProjectStatus
              let status: ProjectStatus = "pending";
              const rawStatus = (item.status || "").toLowerCase();
              if (rawStatus === "ongoing" || rawStatus === "devam eden" || rawStatus === "active") {
                status = "ongoing";
              } else if (rawStatus === "completed" || rawStatus === "tamamlanan" || rawStatus === "finished") {
                status = "completed";
              }

              // Determine overlays for completed projects
              let showCheckmark = false;
              let overlayText = "";
              let overlayIcon: "star-yellow" | "star-green" | undefined = undefined;
              let overlayAction: OverlayAction | undefined = undefined;

              if (status === "completed") {
                showCheckmark = true;
                // If it has evaluationId, it was evaluated
                if (item.evaluationId) {
                  overlayText = "Değerlendirmeyi Gör";
                  overlayIcon = "star-yellow";
                  overlayAction = "view";
                } else {
                  overlayText = "Influencer'ı Değerlendir";
                  overlayIcon = "star-yellow";
                  overlayAction = "evaluate";
                }
              }

              // Extract date
              let formattedDate = "-";
              const dateVal = item.date || item.createdAt || item.startDate || item.createDate;
              if (dateVal) {
                const d = new Date(dateVal);
                formattedDate = `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
              }

              // Resolve image URL
              let imageSrc = item.imageUrl || item.image || "/images/soiree.png";
              if (imageSrc && !imageSrc.startsWith("http") && !imageSrc.startsWith("/")) {
                 imageSrc = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://complexity-cloud-awarded-mug.trycloudflare.com'}/${imageSrc.replace(/\\/g, '/').replace(/^\//, '')}`;
              }

              return {
                id: item.id || Math.random().toString(),
                title: item.name || item.title || "İsimsiz Proje",
                description: item.description || "",
                imageSrc,
                location: item.city || item.location || "-",
                date: formattedDate,
                type: item.type || item.category || "-",
                assignee: item.influencerName || item.assignee || "-",
                applicationCount: item.applicationCount,
                socialMediaLink: item.socialMediaLink || "",
                status,
                showCheckmark,
                overlayText,
                overlayIcon,
                overlayAction,
                applicationId: item.applicationId,
                influencerId: item.influencerId,
                evaluationId: item.evaluationId,
              };
            });

            setProjects(mappedProjects);
          } else {
            setError(response.message || 'Projeler alınamadı.');
          }
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Projeler yüklenirken bir hata oluştu.');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      mounted = false;
    };
  }, [JSON.stringify(filters)]);

  return { projects, isLoading, error, setProjects };
};
