import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import API from "../api/axios";
import ProjectCard from "../components/ProjectCard";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Projects = () => {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data.projects);
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

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-500 mt-2">
            {user?.role === "admin"
              ? "Create, edit and manage your team projects."
              : "View projects where you are added as a member."}
          </p>
        </div>

        {user?.role === "admin" && (
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold transition"
          >
            <Plus size={18} />
            New Project
          </button>
        )}
      </div>

      {projects.length > 0 ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onEdit={openEditModal}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-3xl p-10 text-center">
          <h2 className="text-xl font-bold text-slate-900">
            No projects found
          </h2>
          <p className="text-slate-500 mt-2">
            {user?.role === "admin"
              ? "Create your first project to start assigning tasks."
              : "You are not added to any project yet."}
          </p>
        </div>
      )}

      {showModal && (
        <div
  onClick={closeModal}
  className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4 overflow-y-auto"
>
          <div
  onClick={(e) => e.stopPropagation()}
  className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
>
   <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingProject ? "Edit Project" : "Create Project"}
              </h2>

              <button
                onClick={closeModal}
                className="p-2 hover:bg-slate-100 rounded-xl"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmitProject} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Project Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Team Task Manager"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Write project description..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition">
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