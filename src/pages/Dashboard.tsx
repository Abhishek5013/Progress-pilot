
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import ProjectCard, { Project } from "@/components/Projects/ProjectCard";
import NewProjectDialog from "@/components/Projects/NewProjectDialog";
import { useToast } from "@/components/ui/use-toast";

const mockProjects: Project[] = [
  {
    id: "1",
    title: "Website Redesign",
    description: "Complete overhaul of the company website with new branding and improved UX.",
    tasksTotal: 8,
    tasksCompleted: 3,
    createdAt: "2023-05-01T00:00:00.000Z",
  },
  {
    id: "2",
    title: "Mobile App Development",
    description: "Create a mobile app version of our platform for iOS and Android.",
    tasksTotal: 12,
    tasksCompleted: 5,
    createdAt: "2023-04-15T00:00:00.000Z",
  },
];

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, fetch projects from the API
    // For now, use mock data
    setProjects(mockProjects);
  }, []);

  const handleCreateProject = (projectData: { title: string; description: string }) => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: projectData.title,
      description: projectData.description,
      tasksTotal: 0,
      tasksCompleted: 0,
      createdAt: new Date().toISOString(),
    };

    setProjects((prev) => [...prev, newProject]);
  };

  return (
    <DashboardLayout title="Dashboard">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold">My Projects</h3>
        <NewProjectDialog onProjectCreate={handleCreateProject} projectCount={projects.length} />
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-600 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-4">Create your first project to get started</p>
          <NewProjectDialog onProjectCreate={handleCreateProject} projectCount={0} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
