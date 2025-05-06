
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import TaskCard from "@/components/Tasks/TaskCard";
import NewTaskDialog from "@/components/Tasks/NewTaskDialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Project, Task } from "@/types";

const mockTasks: Task[] = [
  {
    id: "1",
    projectId: "1",
    title: "Design homepage wireframes",
    description: "Create wireframes for the new homepage layout",
    status: "Done",
    createdAt: "2023-05-01T00:00:00.000Z",
    completedAt: "2023-05-03T00:00:00.000Z",
  },
  {
    id: "2",
    projectId: "1",
    title: "Implement responsive design",
    description: "Make sure the website works well on mobile devices",
    status: "In Progress",
    createdAt: "2023-05-02T00:00:00.000Z",
    completedAt: null,
  },
  {
    id: "3",
    projectId: "1",
    title: "Optimize website performance",
    description: "Improve page load times and overall performance",
    status: "Todo",
    createdAt: "2023-05-04T00:00:00.000Z",
    completedAt: null,
  },
  {
    id: "4",
    projectId: "2",
    title: "Create API endpoints",
    description: "Design and implement backend API for the mobile app",
    status: "Done",
    createdAt: "2023-04-16T00:00:00.000Z",
    completedAt: "2023-04-20T00:00:00.000Z",
  },
];

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

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // In a real app, fetch project from the API
    const foundProject = mockProjects.find((p) => p.id === projectId);
    if (foundProject) {
      setProject(foundProject);
    } else {
      navigate("/dashboard");
      toast({
        title: "Project not found",
        description: "The requested project could not be found.",
        variant: "destructive",
      });
    }

    // In a real app, fetch tasks from the API
    const projectTasks = mockTasks.filter((task) => task.projectId === projectId);
    setTasks(projectTasks);
  }, [projectId, navigate, toast]);

  const handleCreateTask = (taskData: { title: string; description: string; status: string }) => {
    const newTask: Task = {
      id: Date.now().toString(),
      projectId: projectId || "",
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      createdAt: new Date().toISOString(),
      completedAt: taskData.status === "Done" ? new Date().toISOString() : null,
    };

    setTasks((prev) => [...prev, newTask]);

    // Update project task counts
    if (project) {
      const updatedProject = {
        ...project,
        tasksTotal: project.tasksTotal + 1,
        tasksCompleted: taskData.status === "Done" ? project.tasksCompleted + 1 : project.tasksCompleted,
      };
      setProject(updatedProject);
    }
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );

    // Update project task completion count if status changed to/from Done
    if (project) {
      const originalTask = tasks.find((t) => t.id === updatedTask.id);
      let completedDelta = 0;

      if (originalTask?.status !== "Done" && updatedTask.status === "Done") {
        completedDelta = 1;
      } else if (originalTask?.status === "Done" && updatedTask.status !== "Done") {
        completedDelta = -1;
      }

      if (completedDelta !== 0) {
        const updatedProject = {
          ...project,
          tasksCompleted: project.tasksCompleted + completedDelta,
        };
        setProject(updatedProject);
      }
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    
    setTasks((prev) => prev.filter((task) => task.id !== taskId));

    // Update project task counts
    if (project && taskToDelete) {
      const updatedProject = {
        ...project,
        tasksTotal: project.tasksTotal - 1,
        tasksCompleted: taskToDelete.status === "Done" ? project.tasksCompleted - 1 : project.tasksCompleted,
      };
      setProject(updatedProject);
    }
  };

  if (!project) {
    return null;
  }

  const progressPercentage = project.tasksTotal > 0 
    ? Math.round((project.tasksCompleted / project.tasksTotal) * 100) 
    : 0;

  return (
    <DashboardLayout title={project.title}>
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="text-sm text-gray-500 mb-4">
              Created on {new Date(project.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="text-sm text-gray-500">
              {project.tasksCompleted} of {project.tasksTotal} tasks completed
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Tasks</h3>
          <NewTaskDialog projectId={project.id} onTaskCreate={handleCreateTask} />
        </div>

        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-600 mb-2">No tasks yet</h3>
              <p className="text-gray-500 mb-4">Add your first task to start tracking progress</p>
              <NewTaskDialog projectId={project.id} onTaskCreate={handleCreateTask} />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Tasks by status */}
              {["Todo", "In Progress", "Done"].map((status) => {
                const statusTasks = tasks.filter((task) => task.status === status);
                if (statusTasks.length === 0) return null;
                
                return (
                  <div key={status} className="mb-6">
                    <h4 className="text-lg font-medium mb-3">{status}</h4>
                    <div className="space-y-3">
                      {statusTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onTaskUpdate={handleUpdateTask}
                          onTaskDelete={handleDeleteTask}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetail;
