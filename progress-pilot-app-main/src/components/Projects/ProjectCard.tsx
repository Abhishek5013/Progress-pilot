
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export interface Project {
  id: string;
  title: string;
  description: string;
  tasksTotal: number;
  tasksCompleted: number;
  createdAt: string;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const progressPercentage = project.tasksTotal > 0 
    ? Math.round((project.tasksCompleted / project.tasksTotal) * 100) 
    : 0;

  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">{project.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4 line-clamp-3">{project.description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{project.tasksCompleted} of {project.tasksTotal} tasks completed</span>
            <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link 
          to={`/project/${project.id}`}
          className="w-full"
        >
          <Button variant="outline" className="w-full">View Project</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
