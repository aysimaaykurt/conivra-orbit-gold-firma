import { useState, useEffect } from 'react';
import { getProjectsList } from '../api/projects/projects.service';
import type { ProjectItem, GetProjectsParams } from '../api/projects/projects.models';
import { Project, ProjectStatus, OverlayAction } from '../mocks/projects';
import { BASE_URL } from '../api/axios';

export const useProjects = (filters?: GetProjectsParams) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refetch = () => setRefreshTrigger((prev) => prev + 1);

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
              let status: ProjectStatus = "inactive";
              const rawStatusStr = String(item.status || "").toLowerCase();
              if (["draft", "pending", "active", "completed", "cancelled", "expired", "paused", "inactive"].includes(rawStatusStr)) {
                status = rawStatusStr as ProjectStatus;
              } else if (rawStatusStr === "1") {
                status = "pending";
              } else if (rawStatusStr === "2" || rawStatusStr === "ongoing" || rawStatusStr === "devam eden") {
                status = "active";
              } else if (rawStatusStr === "6" || rawStatusStr === "tamamlanan") {
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
              let imageSrc = item.image || item.imageUrl || "/images/soiree.png";
              if (imageSrc && imageSrc !== "/images/soiree.png") {
                if (imageSrc.includes('localhost:5100')) {
                  const tunnelOrigin = new URL(BASE_URL).origin;
                  imageSrc = imageSrc.replace(/https?:\/\/localhost:5100/g, tunnelOrigin);
                } else if (!imageSrc.startsWith('http')) {
                  const tunnelOrigin = new URL(BASE_URL).origin;
                  imageSrc = `${tunnelOrigin}/${imageSrc.replace(/\\/g, '/').replace(/^\//, '')}`;
                }
              }

              // Extract and format new dates
              const sDate = item.startDate ? new Date(item.startDate).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : undefined;
              const eDate = item.endDate ? new Date(item.endDate).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : undefined;

              return {
                id: item.id || Math.random().toString(),
                title: item.name || item.title || "İsimsiz Proje",
                description: item.description || "",
                imageSrc,
                location: item.location || item.city || "-",
                date: formattedDate,
                startDate: sDate,
                endDate: eDate,
                type: item.type || item.category || "-",
                category: item.category,
                sector: item.sector,
                platforms: item.platforms,
                assignee: item.influencerName || item.assignee || "-",
                applicationCount: item.applicationCount,
                socialMediaLink: item.socialMediaLink || "",
                status,
                rawStatus: String(item.status || ""),
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
  }, [JSON.stringify(filters), refreshTrigger]);

  return { projects, isLoading, error, setProjects, refetch };
};
