import { useEffect, useState } from "react";
import {
  Plus,
  X,
  FolderKanban,
  Search,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import API from "../api/axios";
import ProjectCard from "../components/ProjectCard";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import useLockBodyScroll from "../hooks/useLockBodyScroll";

const Projects = () => {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useLockBodyScroll(showModal);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data.projects || []);
    } catch (error) {
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      name: "",
      description: "",
    });
    setShowModal(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name || "",
      description: project.description || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setFormData({
      name: "",
      description: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();

    try {
      if (editingProject) {
        await API.put(`/projects/${editingProject._id}`, formData);
        toast.success("Project updated successfully");
      } else {
        await API.post("/projects", formData);
        toast.success("Project created successfully");
      }

      closeModal();
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save project");
    }
  };

  const handleDeleteProject = async (projectId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project? Related tasks will also be deleted."
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/projects/${projectId}`);

      toast.success("Project deleted successfully");
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete project");
    }
  };

  const filteredProjects = projects.filter((project) => {
    const search = searchTerm.toLowerCase();

    return (
      project?.name?.toLowerCase().includes(search) ||
      project?.description?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-700 p-8 text-white shadow-2xl">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 left-20 h-60 w-60 rounded-full bg-indigo-300/20 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-indigo-100 text-sm font-bold mb-5">
              <Sparkles size={16} />
              Project Workspace
            </span>

            <h1 className="text-4xl font-extrabold tracking-tight">
              Projects
            </h1>

            <p className="text-indigo-100 mt-3 max-w-2xl leading-relaxed">
              {user?.role === "admin"
                ? "Create projects, organize team members, and manage work from one clean workspace."
                : "View all projects where you are added as a team member."}
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 text-white rounded-full text-sm font-bold">
                <FolderKanban size={17} />
                {projects.length} Projects
              </span>

              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 text-white rounded-full text-sm font-bold capitalize">
                {user?.role} Access
              </span>
            </div>
          </div>

          {user?.role === "admin" && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3.5 rounded-2xl font-bold transition shadow-lg"
            >
              <Plus size={19} />
              New Project
            </button>
          )}
        </div>
      </div>

      <div className="card p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              All Projects
            </h2>
            <p className="text-slate-500 mt-1">
              Search and manage your project list.
            </p>
          </div>

          <div className="relative w-full lg:w-96">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onEdit={openEditModal}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="card p-12 text-center">
          <div className="mx-auto h-16 w-16 rounded-3xl bg-orange-50 flex items-center justify-center mb-5">
            <Search className="text-orange-600" size={34} />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900">
            No matching projects
          </h2>

          <p className="text-slate-500 mt-2 max-w-md mx-auto">
            No project matched your search. Try another keyword.
          </p>
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="mx-auto h-16 w-16 rounded-3xl bg-indigo-50 flex items-center justify-center mb-5">
            <FolderKanban className="text-indigo-600" size={34} />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900">
            No projects found
          </h2>

          <p className="text-slate-500 mt-2 max-w-md mx-auto">
            {user?.role === "admin"
              ? "Create your first project and start assigning tasks to your team."
              : "You are not added to any project yet."}
          </p>

          {user?.role === "admin" && (
            <button onClick={openCreateModal} className="primary-btn mt-6">
              <Plus size={18} />
              Create First Project
            </button>
          )}
        </div>
      )}

      {showModal && (
        <div onClick={closeModal} className="modal-overlay">
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-box max-w-lg"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                  <FolderKanban className="text-indigo-600" size={25} />
                </div>

                <h2 className="text-2xl font-extrabold text-slate-900">
                  {editingProject ? "Edit Project" : "Create Project"}
                </h2>

                <p className="text-slate-500 mt-1">
                  {editingProject
                    ? "Update your project name and description."
                    : "Add a new project to organize tasks and team members."}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="h-10 w-10 flex items-center justify-center hover:bg-slate-100 rounded-2xl transition shrink-0"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmitProject} className="space-y-5">
              <div>
                <label className="text-sm font-bold text-slate-700">
                  Project Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Team Task Manager"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  placeholder="Write project description..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="input-field resize-none"
                />
              </div>

              {editingProject && (
                <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-100 rounded-2xl p-4">
                  <AlertCircle
                    className="text-yellow-600 shrink-0 mt-0.5"
                    size={19}
                  />

                  <p className="text-sm text-yellow-700">
                    You are editing an existing project. Changes will be updated
                    immediately after saving.
                  </p>
                </div>
              )}

              <button className="primary-btn w-full">
                {editingProject ? "Update Project" : "Create Project"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;