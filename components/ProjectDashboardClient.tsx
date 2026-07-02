"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import type { Project } from "@/lib/projects";

const categoryOptions = [
  { label: "RESIDENTIAL", value: "residential" },
  { label: "COMMERCIAL", value: "commercial" },
  { label: "RENOVATION", value: "renovation" },
  { label: "POP-UPS", value: "popups" }
];

type PreviewImage = {
  file: File;
  src: string;
};

function getStatusMessage(data: unknown, fallback: string) {
  if (!data || typeof data !== "object") {
    return fallback;
  }

  const payload = data as { data?: unknown; message?: unknown; error?: unknown };

  for (const value of [payload.data, payload.message, payload.error]) {
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return fallback;
}

function trimDescription(value: string) {
  const words = value.split(/\s+/).filter(Boolean);
  return words.length > 10 ? `${words.slice(0, 10).join(" ")}...` : value;
}

async function watermarkFile(file: File) {
  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new window.Image();
    element.onload = () => resolve(element);
    element.onerror = reject;
    element.src = source;
  });

  const logo = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new window.Image();
    element.onload = () => resolve(element);
    element.onerror = reject;
    element.src = "/images/hero-logo.png";
  });

  const maxDimension = 1800;
  const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
  const outputWidth = Math.max(1, Math.round(image.naturalWidth * scale));
  const outputHeight = Math.max(1, Math.round(image.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    return file;
  }

  context.drawImage(image, 0, 0, outputWidth, outputHeight);

  const targetWidth = Math.max(140, Math.min(canvas.width * 0.2, 240));
  const targetHeight = targetWidth * (logo.naturalHeight / logo.naturalWidth);
  const margin = Math.max(24, canvas.width * 0.025);

  context.globalAlpha = 0.38;
  context.drawImage(logo, margin, canvas.height - targetHeight - margin, targetWidth, targetHeight);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.78));
  if (!blob) {
    return file;
  }

  return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" });
}

async function previewFile(file: File) {
  const src = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  return { file, src };
}

export function ProjectDashboardClient({ initialProjects }: { initialProjects: Project[] }) {
  const router = useRouter();
  const addFileRef = useRef<HTMLInputElement>(null);
  const [projects, setProjects] = useState(initialProjects);
  const [activeTab, setActiveTab] = useState<"add" | "edit">("add");
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [addPreviews, setAddPreviews] = useState<PreviewImage[]>([]);
  const [editProjectId, setEditProjectId] = useState("");
  const [editImages, setEditImages] = useState<string[]>([]);
  const [newEditImages, setNewEditImages] = useState<PreviewImage[]>([]);
  const [replaceImages, setReplaceImages] = useState<Record<number, PreviewImage>>({});

  const selectedProject = useMemo(
    () => projects.find((project) => String(project.id) === editProjectId) ?? null,
    [editProjectId, projects]
  );

  const refreshProjects = async () => {
    const response = await fetch("/api/project-dashboard/projects", { cache: "no-store" });
    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { projects?: Project[] };
    const nextProjects = Array.isArray(data.projects) ? data.projects : [];
    setProjects(nextProjects);
    return nextProjects;
  };

  const handleAddFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const openSlots = Math.max(0, 6 - addPreviews.length);
      const files = Array.from(event.target.files || []).slice(0, openSlots);
      if (files.length === 0) {
        setStatus(addPreviews.length >= 6 ? "Maximum of 6 pictures reached." : "");
        event.target.value = "";
        return;
      }

      const watermarked = await Promise.all(files.map((file) => watermarkFile(file).then(previewFile)));
      setAddPreviews((current) => [...current, ...watermarked].slice(0, 6));
      setStatus(addPreviews.length + watermarked.length >= 6 ? "Maximum of 6 pictures reached." : "");
      event.target.value = "";
    } catch {
      setStatus("Unable to prepare the selected image. Please try a smaller image.");
      event.target.value = "";
    }
  };

  const submitForm = async (formData: FormData) => {
    setStatus("");
    setIsSaving(true);

    try {
      const response = await fetch("/api/project-dashboard/mutate", {
        method: "POST",
        body: formData
      });
      const data = (await response.json().catch(() => ({}))) as unknown;

      if (!response.ok || (typeof data === "object" && data !== null && "success" in data && data.success === false)) {
        setStatus(getStatusMessage(data, "Unable to save project."));
        return false;
      }

      setStatus("Success.");
      const nextProjects = await refreshProjects();
      return nextProjects ?? true;
    } catch {
      setStatus("Upload failed before it reached WordPress. Please try a smaller image or fewer images.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("action", "add_jlds_project");
    formData.delete("project_images[]");

    addPreviews.forEach((preview) => {
      formData.append("project_images[]", preview.file);
    });

    const result = await submitForm(formData);
    if (result) {
      event.currentTarget.reset();
      setAddPreviews([]);
      if (addFileRef.current) {
        addFileRef.current.value = "";
      }
    }
  };

  const loadEditProject = (projectId: string) => {
    setEditProjectId(projectId);
    setReplaceImages({});
    setNewEditImages([]);

    const project = projects.find((item) => String(item.id) === projectId);
    setEditImages(project?.images.map((image) => image.url) ?? []);
  };

  const handleEditImageAdd = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const openSlots = Math.max(0, 6 - editImages.length - newEditImages.length);
      const files = Array.from(event.target.files || []).slice(0, openSlots);
      const watermarked = await Promise.all(files.map((file) => watermarkFile(file).then(previewFile)));
      setNewEditImages((current) => [...current, ...watermarked]);
      setStatus("");
      event.target.value = "";
    } catch {
      setStatus("Unable to prepare the selected image. Please try a smaller image.");
      event.target.value = "";
    }
  };

  const handleReplaceImage = async (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const watermarked = await watermarkFile(file).then(previewFile);
      setReplaceImages((current) => ({ ...current, [index]: watermarked }));
      setStatus("");
    } catch {
      setStatus("Unable to prepare the selected image. Please try a smaller image.");
      event.target.value = "";
    }
  };

  const handleEditProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("action", "update_jlds_project");
    formData.set("id", editProjectId);
    formData.delete("new_project_images[]");

    Object.entries(replaceImages).forEach(([index, preview]) => {
      formData.append(`replace_images[${index}]`, preview.file);
    });

    newEditImages.forEach((preview) => {
      formData.append("new_project_images[]", preview.file);
    });

    const result = await submitForm(formData);
    if (result) {
      const refreshedProjects = Array.isArray(result) ? result : projects;
      const refreshedProject = refreshedProjects.find((project) => String(project.id) === editProjectId);
      setReplaceImages({});
      setNewEditImages([]);
      setEditImages(refreshedProject?.images.map((image) => image.url) ?? []);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!window.confirm("Are you sure to delete this project?")) {
      return;
    }

    const formData = new FormData();
    formData.set("action", "delete_jlds_project");
    formData.set("id", String(projectId));
    await submitForm(formData);
  };

  const handleLogout = async () => {
    await fetch("/api/project-auth/logout", { method: "POST" });
    router.replace("/project-login");
    router.refresh();
  };

  return (
    <main className="project-dashboard utility-page">
      <div className="dash-bg-text">PROJECTS</div>

      <header className="dash-header">
        <button className="btn-logout" onClick={handleLogout} type="button">
          LOGOUT
        </button>
      </header>

      <div className="dash-container">
        <div className="dash-tabs">
          <button className={`tab-btn${activeTab === "add" ? " active" : ""}`} onClick={() => setActiveTab("add")} type="button">
            ADD NEW PROJECT
          </button>
          <button className={`tab-btn${activeTab === "edit" ? " active" : ""}`} onClick={() => setActiveTab("edit")} type="button">
            EDIT PROJECT
          </button>
        </div>

        <div className="dash-content-card">
          {status ? <p className="dash-status">{status}</p> : null}

          {activeTab === "add" ? (
            <form className="dash-form" onSubmit={handleAddProject}>
              <div className="form-row">
                <div className="form-group col-left">
                  <select name="category" required defaultValue="">
                    <option value="" disabled>
                      SELECT CATEGORY
                    </option>
                    {categoryOptions.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="add-project-name">PROJECT NAME</label>
                  <input id="add-project-name" type="text" name="project_name" required />

                  <label htmlFor="add-project-description">DESCRIPTIONS</label>
                  <textarea id="add-project-description" name="description" rows={8} required />
                </div>

                <div className="form-group col-right">
                  <label htmlFor="project-images">ADD PICTURES (Max 6)</label>
                  <div className="file-upload-container">
                    <input
                      className="btn-secondary"
                      id="project-images"
                      multiple
                      accept="image/*"
                      ref={addFileRef}
                      type="file"
                      disabled={addPreviews.length >= 6 || isSaving}
                      onChange={handleAddFiles}
                    />
                    <button className="btn-primary" disabled={isSaving} type="submit">
                      {isSaving ? "SAVING..." : "ADD"}
                    </button>
                  </div>
                  <div className="image-preview-grid">
                    {addPreviews.map((preview) => (
                      <div className="preview-item" key={preview.src}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preview.src} alt="" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <form className="dash-form" onSubmit={handleEditProject}>
              <div className="edit-actions-top">
                <button className="btn-save" disabled={!selectedProject || isSaving} type="submit">
                  {isSaving ? "SAVING..." : "SAVE"}
                </button>
                <button className="btn-cancel" onClick={() => setActiveTab("add")} type="button">
                  CANCEL
                </button>
              </div>

              <div className="form-row">
                <div className="form-group col-left">
                  <select name="category" required defaultValue={selectedProject?.category ?? ""} key={`category-${editProjectId}`}>
                    <option value="" disabled>
                      SELECT CATEGORY
                    </option>
                    {categoryOptions.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>

                  <select value={editProjectId} onChange={(event) => loadEditProject(event.target.value)}>
                    <option value="">SELECT PROJECT</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="edit-project-name">PROJECT NAME</label>
                  <input id="edit-project-name" type="text" name="project_name" required defaultValue={selectedProject?.title ?? ""} key={`name-${editProjectId}`} />

                  <label htmlFor="edit-project-description">DESCRIPTIONS</label>
                  <textarea
                    id="edit-project-description"
                    name="description"
                    rows={8}
                    required
                    defaultValue={selectedProject?.description ?? ""}
                    key={`desc-${editProjectId}`}
                  />
                </div>

                <div className="form-group col-right-edit">
                  <label>EDIT PICTURES</label>
                  <div className="image-management-grid">
                    {editImages.map((imageUrl, index) => (
                      <div className="img-manage-item" key={`${imageUrl}-${index}`}>
                        <div className="img-manage-thumb">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={replaceImages[index]?.src || imageUrl} alt="" />
                        </div>
                        <div className="img-manage-btns">
                          <button
                            className="btn-img-del"
                            onClick={() => setEditImages((current) => current.filter((_, currentIndex) => currentIndex !== index))}
                            type="button"
                          >
                            DELETE
                          </button>
                          <label className="btn-img-replace">
                            {replaceImages[index] ? "IMAGE SELECTED" : "REPLACE"}
                            <input hidden accept="image/*" type="file" onChange={(event) => handleReplaceImage(index, event)} />
                          </label>
                        </div>
                        <input type="hidden" name="existing_images[]" value={imageUrl} />
                      </div>
                    ))}

                    {newEditImages.map((preview) => (
                      <div className="img-manage-item" key={preview.src}>
                        <div className="img-manage-thumb">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={preview.src} alt="" />
                        </div>
                        <div className="img-manage-btns">
                          <button className="btn-img-del" onClick={() => setNewEditImages((current) => current.filter((item) => item.src !== preview.src))} type="button">
                            DELETE
                          </button>
                        </div>
                      </div>
                    ))}

                    {selectedProject && editImages.length + newEditImages.length < 6 ? (
                      <div className="img-add-container">
                        <input className="btn-secondary" accept="image/*" multiple type="file" onChange={handleEditImageAdd} />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </form>
          )}

          <div className="project-table-wrapper">
            <table className="project-table">
              <thead>
                <tr>
                  <th>CATEGORY</th>
                  <th>PROJECT NAME</th>
                  <th>DESCRIPTIONS</th>
                  <th>PICTURES</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.categoryLabel}</td>
                    <td>{project.title}</td>
                    <td className="td-desc">{trimDescription(project.description)}</td>
                    <td>{project.images.length}</td>
                    <td className="actions">
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setActiveTab("edit");
                          loadEditProject(String(project.id));
                        }}
                        type="button"
                      >
                        EDIT
                      </button>
                      <button className="remove-btn" onClick={() => handleDeleteProject(project.id)} type="button">
                        REMOVE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
