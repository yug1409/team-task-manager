import { Link } from "react-router-dom";
import {
  FolderKanban,
  Users,
  ArrowRight,
  Pencil,
  Trash2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const { user } = useAuth();

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition">
      <div className="flex items-start justify-between gap-4">
        <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
          <FolderKanban className="text-indigo-600" size={24} />
        </div>

        {user?.role === "admin" && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(project)}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-indigo-600"
              title="Edit Project"
            >
              <Pencil size={17} />
            </button>

            <button
              onClick={() => onDelete(project._id)}
              className="p-2 rounded-xl hover:bg-red-50 text-slate-500 hover:text-red-600"
              title="Delete Project"
            >
              <Trash2 size={17} />
            </button>
          </div>
        )}
      </div>

      <div className="mt-5">
        <h3 className="text-xl font-bold text-slate-900 line-clamp-1">
          {project?.name}
        </h3>

        <p className="text-slate-500 text-sm mt-2 line-clamp-2 min-h-[40px]">
          {project?.description || "No description provided."}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Users size={18} />
          <span>{project?.members?.length || 0} Members</span>
        </div>

        <Link
          to={`/projects/${project?._id}`}
          className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700"
        >
          View
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;