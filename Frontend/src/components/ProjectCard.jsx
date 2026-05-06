import { Link } from "react-router-dom";
import {
  FolderKanban,
  Users,
  ArrowRight,
  Pencil,
  Trash2,
  CalendarDays,
  Layers3,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const { user } = useAuth();

  const createdDate = project?.createdAt
    ? new Date(project.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="group relative overflow-hidden bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition" />
      <div className="absolute -left-10 -bottom-12 h-28 w-28 rounded-full bg-slate-50" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="h-14 w-14 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <FolderKanban className="text-white" size={26} />
          </div>

          {user?.role === "admin" && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(project)}
                className="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition"
                title="Edit Project"
              >
                <Pencil size={17} />
              </button>

              <button
                onClick={() => onDelete(project._id)}
                className="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 transition"
                title="Delete Project"
              >
                <Trash2 size={17} />
              </button>
            </div>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-extrabold text-slate-900 line-clamp-1 group-hover:text-indigo-700 transition">
            {project?.name}
          </h3>

          <p className="text-slate-500 text-sm mt-3 line-clamp-2 min-h-[42px] leading-relaxed">
            {project?.description || "No description provided."}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
              <Users size={15} />
              Members
            </div>

            <p className="text-slate-900 font-extrabold mt-1">
              {project?.members?.length || 0}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
              <CalendarDays size={15} />
              Created
            </div>

            <p className="text-slate-900 font-extrabold mt-1 text-sm">
              {createdDate}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
            <Layers3 size={14} />
            Project
          </div>

          <Link
            to={`/projects/${project?._id}`}
            className="inline-flex items-center gap-2 bg-slate-950 hover:bg-indigo-600 text-white px-4 py-2.5 rounded-2xl font-bold text-sm transition"
          >
            View Details
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;