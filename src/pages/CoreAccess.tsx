import Title from "@/components/decoration/Title";
import { AuthContext } from "@/shared/context/AuthContext";
import { ModalContext } from "@/shared/context/ModalContext";
import { useAuth } from "@shinederu/auth-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";

type CoreProject = {
  id: number;
  code: string;
  name: string;
  description: string;
  is_active: boolean;
  roles: CoreRole[];
  permissions: CorePermission[];
};

type CoreRole = {
  id: number;
  project_id: number;
  project_code: string;
  role_key: string;
  label: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  permission_ids: number[];
  permission_keys: string[];
};

type CorePermission = {
  id: number;
  project_id: number;
  project_code: string;
  permission_key: string;
  label: string;
  description: string;
  is_active: boolean;
};

type CoreUser = {
  id: number;
  username: string;
  email: string;
  role: string;
  is_global_admin: boolean;
  project_roles: Record<string, string[]>;
};

type CoreOverview = {
  projects: CoreProject[];
  roles: CoreRole[];
  permissions: CorePermission[];
  users: CoreUser[];
};

type ProjectForm = {
  id: number;
  code: string;
  name: string;
  description: string;
  is_active: boolean;
};

type RoleForm = {
  id: number;
  project_id: number;
  role_key: string;
  label: string;
  description: string;
  sort_order: number;
  is_active: boolean;
};

type PermissionForm = {
  id: number;
  project_id: number;
  permission_key: string;
  label: string;
  description: string;
  is_active: boolean;
};

type TabKey = "projects" | "roles" | "users";

const emptyProjectForm: ProjectForm = {
  id: 0,
  code: "",
  name: "",
  description: "",
  is_active: true,
};

const emptyRoleForm: RoleForm = {
  id: 0,
  project_id: 0,
  role_key: "",
  label: "",
  description: "",
  sort_order: 0,
  is_active: true,
};

const emptyPermissionForm: PermissionForm = {
  id: 0,
  project_id: 0,
  permission_key: "",
  label: "",
  description: "",
  is_active: true,
};

const unwrapData = <T,>(value: unknown): T | null => {
  if (!value || typeof value !== "object") return null;
  const root = value as Record<string, unknown>;
  const data = root.data && typeof root.data === "object" ? root.data : root;
  return data as T;
};

const sortByCode = (projects: CoreProject[]) => [...projects].sort((a, b) => a.code.localeCompare(b.code));

const CoreAccess = () => {
  const authCtx = useContext(AuthContext);
  const modalCtx = useContext(ModalContext);
  const auth = useAuth();
  const [overview, setOverview] = useState<CoreOverview | null>(null);
  const [tab, setTab] = useState<TabKey>("projects");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [projectForm, setProjectForm] = useState<ProjectForm>(emptyProjectForm);
  const [roleForm, setRoleForm] = useState<RoleForm>(emptyRoleForm);
  const [rolePermissionIds, setRolePermissionIds] = useState<number[]>([]);
  const [permissionForm, setPermissionForm] = useState<PermissionForm>(emptyPermissionForm);
  const [selectedRoleProjectId, setSelectedRoleProjectId] = useState(0);
  const [selectedPermissionProjectId, setSelectedPermissionProjectId] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [selectedProjectCode, setSelectedProjectCode] = useState("core");
  const [selectedRoleKeys, setSelectedRoleKeys] = useState<string[]>([]);

  const projects = useMemo(() => sortByCode(overview?.projects ?? []), [overview]);
  const activeProjects = useMemo(() => projects.filter((project) => project.is_active), [projects]);
  const selectedRoleProject = useMemo(
    () => projects.find((project) => project.id === selectedRoleProjectId) ?? projects[0] ?? null,
    [projects, selectedRoleProjectId]
  );
  const selectedPermissionProject = useMemo(
    () => projects.find((project) => project.id === selectedPermissionProjectId) ?? projects[0] ?? null,
    [projects, selectedPermissionProjectId]
  );
  const filteredRoles = useMemo(
    () => overview?.roles.filter((role) => role.project_id === selectedRoleProject?.id) ?? [],
    [overview, selectedRoleProject]
  );
  const filteredPermissions = useMemo(
    () => overview?.permissions.filter((permission) => permission.project_id === selectedPermissionProject?.id) ?? [],
    [overview, selectedPermissionProject]
  );
  const selectedAssignmentProject = useMemo(
    () => projects.find((project) => project.code === selectedProjectCode) ?? projects[0] ?? null,
    [projects, selectedProjectCode]
  );
  const selectedUser = useMemo(
    () => overview?.users.find((user) => user.id === selectedUserId) ?? overview?.users[0] ?? null,
    [overview, selectedUserId]
  );

  const loadOverview = async () => {
    setLoading(true);
    const response = await auth.invoke("GET", "listCoreAccess");
    if (!response.ok) {
      setOverview(null);
      setLoading(false);
      modalCtx.open(response.error ?? "Chargement impossible.", "error");
      return;
    }

    const data = unwrapData<CoreOverview>(response.data);
    setOverview(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!authCtx.is_admin) return;
    void loadOverview();
  }, [authCtx.is_admin]);

  useEffect(() => {
    if (!overview) return;
    if (selectedRoleProjectId === 0 && projects[0]) {
      setSelectedRoleProjectId(projects[0].id);
      setRoleForm((form) => ({ ...form, project_id: projects[0].id }));
    }
    if (selectedPermissionProjectId === 0 && projects[0]) {
      setSelectedPermissionProjectId(projects[0].id);
      setPermissionForm((form) => ({ ...form, project_id: projects[0].id }));
    }
    if (selectedUserId === 0 && overview.users[0]) {
      setSelectedUserId(overview.users[0].id);
    }
    if (!projects.some((project) => project.code === selectedProjectCode) && projects[0]) {
      setSelectedProjectCode(projects[0].code);
    }
  }, [overview, projects, selectedPermissionProjectId, selectedProjectCode, selectedRoleProjectId, selectedUserId]);

  useEffect(() => {
    if (!selectedUser || !selectedAssignmentProject) {
      setSelectedRoleKeys([]);
      return;
    }
    setSelectedRoleKeys(selectedUser.project_roles[selectedAssignmentProject.code] ?? []);
  }, [selectedAssignmentProject, selectedUser]);

  const mutate = async (action: string, payload: Record<string, unknown>) => {
    setSaving(true);
    const response = await auth.invoke("PUT", action, payload);
    setSaving(false);

    if (!response.ok) {
      modalCtx.open(response.error ?? "Enregistrement impossible.", "error");
      return null;
    }

    return unwrapData<Record<string, unknown>>(response.data);
  };

  const saveProject = async () => {
    const result = await mutate("saveCoreProject", projectForm);
    if (!result) return;
    await loadOverview();
    modalCtx.open("Projet enregistre.", "result");
  };

  const saveRole = async () => {
    const result = await mutate("saveCoreRole", roleForm);
    if (!result) return;

    const role = result.role as CoreRole | undefined;
    const roleId = Number(role?.id ?? roleForm.id);
    if (roleId > 0) {
      const mappingResult = await mutate("setCoreRolePermissions", {
        role_id: roleId,
        permission_ids: rolePermissionIds,
      });
      if (!mappingResult) return;
    }

    await loadOverview();
    modalCtx.open("Role enregistre.", "result");
  };

  const savePermission = async () => {
    const result = await mutate("saveCorePermission", permissionForm);
    if (!result) return;
    await loadOverview();
    modalCtx.open("Permission enregistree.", "result");
  };

  const saveUserRoles = async () => {
    if (!selectedUser || !selectedAssignmentProject) return;
    const result = await mutate("setCoreUserProjectRoles", {
      user_id: selectedUser.id,
      project_code: selectedAssignmentProject.code,
      role_keys: selectedRoleKeys,
    });
    if (!result) return;
    await loadOverview();
    await authCtx.reload();
    modalCtx.open("Roles utilisateur enregistres.", "result");
  };

  const loadProject = (project: CoreProject | null) => {
    setProjectForm(project ? {
      id: project.id,
      code: project.code,
      name: project.name,
      description: project.description,
      is_active: project.is_active,
    } : emptyProjectForm);
  };

  const loadRole = (role: CoreRole | null) => {
    setRoleForm(role ? {
      id: role.id,
      project_id: role.project_id,
      role_key: role.role_key,
      label: role.label,
      description: role.description,
      sort_order: role.sort_order,
      is_active: role.is_active,
    } : {
      ...emptyRoleForm,
      project_id: selectedRoleProject?.id ?? projects[0]?.id ?? 0,
    });
    if (role) {
      setSelectedRoleProjectId(role.project_id);
    }
    setRolePermissionIds(role?.permission_ids ?? []);
  };

  const loadPermission = (permission: CorePermission | null) => {
    setPermissionForm(permission ? {
      id: permission.id,
      project_id: permission.project_id,
      permission_key: permission.permission_key,
      label: permission.label,
      description: permission.description,
      is_active: permission.is_active,
    } : {
      ...emptyPermissionForm,
      project_id: selectedPermissionProject?.id ?? projects[0]?.id ?? 0,
    });
    if (permission) {
      setSelectedPermissionProjectId(permission.project_id);
    }
  };

  const selectRoleProject = (projectId: number) => {
    setSelectedRoleProjectId(projectId);
    setRoleForm({ ...emptyRoleForm, project_id: projectId });
    setRolePermissionIds([]);
  };

  const selectPermissionProject = (projectId: number) => {
    setSelectedPermissionProjectId(projectId);
    setPermissionForm({ ...emptyPermissionForm, project_id: projectId });
  };

  const togglePermissionId = (permissionId: number) => {
    setRolePermissionIds((current) =>
      current.includes(permissionId)
        ? current.filter((id) => id !== permissionId)
        : [...current, permissionId]
    );
  };

  const toggleRoleKey = (roleKey: string) => {
    setSelectedRoleKeys((current) =>
      current.includes(roleKey)
        ? current.filter((key) => key !== roleKey)
        : [...current, roleKey]
    );
  };

  if (!authCtx.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="w-full text-left">
      <Title size={1} title="Core" />

      <div className="mt-4 flex flex-wrap gap-2">
        {([
          ["projects", "Projets"],
          ["roles", "Roles & permissions"],
          ["users", "Utilisateurs"],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-md px-3 py-2 text-sm transition ${tab === key ? "bg-indigo-600" : "bg-[#252525] hover:bg-[#303030]"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <section className="mt-6 rounded-xl border border-[#2f2f2f] bg-[#181818] p-5">
          Chargement...
        </section>
      ) : !overview ? (
        <section className="mt-6 rounded-xl border border-[#2f2f2f] bg-[#181818] p-5">
          Donnees indisponibles.
        </section>
      ) : (
        <>
          {tab === "projects" ? (
            <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
              <div className="rounded-xl border border-[#2f2f2f] bg-[#181818] p-5">
                <Title size={3} title="Projets declares" />
                <div className="grid gap-3">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => loadProject(project)}
                      className="w-full rounded-lg border border-[#2f2f2f] bg-[#141414] p-4 text-left hover:border-indigo-500"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <strong>{project.name}</strong>
                        <span className={`rounded px-2 py-1 text-xs ${project.is_active ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"}`}>
                          {project.is_active ? "actif" : "inactif"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-400">{project.description || "Aucune description"}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#2f2f2f] bg-[#181818] p-5">
                <div className="flex items-center justify-between gap-3">
                  <Title size={3} title={projectForm.id ? "Modifier" : "Nouveau projet"} />
                  <button type="button" onClick={() => loadProject(null)} className="rounded-md bg-[#252525] px-3 py-2 text-sm">
                    Nouveau
                  </button>
                </div>
                <div className="grid gap-3">
                  <input
                    value={projectForm.code}
                    disabled={projectForm.id > 0}
                    onChange={(event) => setProjectForm((form) => ({ ...form, code: event.target.value }))}
                    className="rounded-md border border-gray-700 bg-[#202020] p-2 disabled:opacity-60"
                    placeholder="code"
                  />
                  <input
                    value={projectForm.name}
                    onChange={(event) => setProjectForm((form) => ({ ...form, name: event.target.value }))}
                    className="rounded-md border border-gray-700 bg-[#202020] p-2"
                    placeholder="Nom"
                  />
                  <textarea
                    value={projectForm.description}
                    onChange={(event) => setProjectForm((form) => ({ ...form, description: event.target.value }))}
                    className="min-h-24 rounded-md border border-gray-700 bg-[#202020] p-2"
                    placeholder="Description"
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={projectForm.is_active}
                      disabled={projectForm.code === "core"}
                      onChange={(event) => setProjectForm((form) => ({ ...form, is_active: event.target.checked }))}
                    />
                    Actif
                  </label>
                  <button disabled={saving} type="button" onClick={saveProject} className="rounded-md bg-indigo-600 px-3 py-2 transition hover:bg-indigo-500 disabled:opacity-60">
                    Enregistrer
                  </button>
                </div>
              </div>
            </section>
          ) : null}

          {tab === "roles" ? (
            <section className="mt-6 grid gap-6 xl:grid-cols-2">
              <div className="rounded-xl border border-[#2f2f2f] bg-[#181818] p-5">
                <div className="flex items-center justify-between gap-3">
                  <Title size={3} title={roleForm.id ? "Role" : "Nouveau role"} />
                  <button type="button" onClick={() => loadRole(null)} className="rounded-md bg-[#252525] px-3 py-2 text-sm">
                    Nouveau
                  </button>
                </div>
                <div className="grid gap-3">
                  <div>
                    <label className="mb-1 block text-sm text-gray-300">Projet</label>
                    <select
                      value={selectedRoleProject?.id ?? 0}
                      onChange={(event) => selectRoleProject(Number(event.target.value))}
                      className="w-full rounded-md border border-gray-700 bg-[#202020] p-2"
                    >
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-gray-300">Role</label>
                    <select
                      value={roleForm.id}
                      onChange={(event) => loadRole(filteredRoles.find((role) => role.id === Number(event.target.value)) ?? null)}
                      className="w-full rounded-md border border-gray-700 bg-[#202020] p-2"
                    >
                      <option value={0}>Nouveau role</option>
                      {filteredRoles.map((role) => (
                        <option key={role.id} value={role.id}>{role.label}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    value={roleForm.role_key}
                    disabled={roleForm.id > 0}
                    onChange={(event) => setRoleForm((form) => ({ ...form, role_key: event.target.value }))}
                    className="rounded-md border border-gray-700 bg-[#202020] p-2 disabled:opacity-60"
                    placeholder="role_key"
                  />
                  <input
                    value={roleForm.label}
                    onChange={(event) => setRoleForm((form) => ({ ...form, label: event.target.value }))}
                    className="rounded-md border border-gray-700 bg-[#202020] p-2"
                    placeholder="Libelle"
                  />
                  <textarea
                    value={roleForm.description}
                    onChange={(event) => setRoleForm((form) => ({ ...form, description: event.target.value }))}
                    className="min-h-20 rounded-md border border-gray-700 bg-[#202020] p-2"
                    placeholder="Description"
                  />
                  <input
                    type="number"
                    value={roleForm.sort_order}
                    onChange={(event) => setRoleForm((form) => ({ ...form, sort_order: Number(event.target.value) }))}
                    className="rounded-md border border-gray-700 bg-[#202020] p-2"
                    placeholder="Ordre"
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={roleForm.is_active}
                      disabled={roleForm.role_key === "super_admin" && selectedRoleProject?.code === "core"}
                      onChange={(event) => setRoleForm((form) => ({ ...form, is_active: event.target.checked }))}
                    />
                    Actif
                  </label>
                  <div className="rounded-lg border border-[#2f2f2f] p-3">
                    <p className="mb-2 text-sm text-gray-300">Permissions du role</p>
                    <div className="grid gap-2">
                      {(selectedRoleProject?.permissions ?? []).map((permission) => (
                        <label key={permission.id} className="flex items-start gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={rolePermissionIds.includes(permission.id)}
                            onChange={() => togglePermissionId(permission.id)}
                          />
                          <span>
                            <strong>{permission.label}</strong>
                            {permission.description ? <span className="block text-gray-400">{permission.description}</span> : null}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <button disabled={saving} type="button" onClick={saveRole} className="rounded-md bg-indigo-600 px-3 py-2 transition hover:bg-indigo-500 disabled:opacity-60">
                    Enregistrer le role
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-[#2f2f2f] bg-[#181818] p-5">
                <div className="flex items-center justify-between gap-3">
                  <Title size={3} title={permissionForm.id ? "Permission" : "Nouvelle permission"} />
                  <button type="button" onClick={() => loadPermission(null)} className="rounded-md bg-[#252525] px-3 py-2 text-sm">
                    Nouvelle
                  </button>
                </div>
                <div className="grid gap-3">
                  <div>
                    <label className="mb-1 block text-sm text-gray-300">Projet</label>
                    <select
                      value={selectedPermissionProject?.id ?? 0}
                      onChange={(event) => selectPermissionProject(Number(event.target.value))}
                      className="w-full rounded-md border border-gray-700 bg-[#202020] p-2"
                    >
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-gray-300">Permission</label>
                    <select
                      value={permissionForm.id}
                      onChange={(event) => loadPermission(filteredPermissions.find((permission) => permission.id === Number(event.target.value)) ?? null)}
                      className="w-full rounded-md border border-gray-700 bg-[#202020] p-2"
                    >
                      <option value={0}>Nouvelle permission</option>
                      {filteredPermissions.map((permission) => (
                        <option key={permission.id} value={permission.id}>{permission.label}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    value={permissionForm.permission_key}
                    disabled={permissionForm.id > 0}
                    onChange={(event) => setPermissionForm((form) => ({ ...form, permission_key: event.target.value }))}
                    className="rounded-md border border-gray-700 bg-[#202020] p-2 disabled:opacity-60"
                    placeholder="permission.key"
                  />
                  <input
                    value={permissionForm.label}
                    onChange={(event) => setPermissionForm((form) => ({ ...form, label: event.target.value }))}
                    className="rounded-md border border-gray-700 bg-[#202020] p-2"
                    placeholder="Libelle"
                  />
                  <textarea
                    value={permissionForm.description}
                    onChange={(event) => setPermissionForm((form) => ({ ...form, description: event.target.value }))}
                    className="min-h-20 rounded-md border border-gray-700 bg-[#202020] p-2"
                    placeholder="Description"
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={permissionForm.is_active}
                      onChange={(event) => setPermissionForm((form) => ({ ...form, is_active: event.target.checked }))}
                    />
                    Active
                  </label>
                  <button disabled={saving} type="button" onClick={savePermission} className="rounded-md bg-indigo-600 px-3 py-2 transition hover:bg-indigo-500 disabled:opacity-60">
                    Enregistrer la permission
                  </button>
                </div>
              </div>
            </section>
          ) : null}

          {tab === "users" ? (
            <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,440px)]">
              <div className="rounded-xl border border-[#2f2f2f] bg-[#181818] p-5">
                <Title size={3} title="Assignations" />
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#2f2f2f]">
                        <th className="py-3 pr-4">Utilisateur</th>
                        <th className="py-3 pr-4">Email</th>
                        <th className="py-3">Roles</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overview.users.map((user) => (
                        <tr key={user.id} className="border-b border-[#252525] align-top">
                          <td className="py-3 pr-4">
                            <button type="button" className="text-left text-indigo-300 hover:text-indigo-200" onClick={() => setSelectedUserId(user.id)}>
                              {user.username}
                            </button>
                            {user.is_global_admin ? <span className="ml-2 rounded bg-green-900 px-2 py-1 text-xs text-green-200">super-admin</span> : null}
                          </td>
                          <td className="py-3 pr-4 text-gray-300">{user.email}</td>
                          <td className="py-3">
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(user.project_roles).flatMap(([projectCode, roles]) =>
                                roles.map((role) => (
                                  <span key={`${user.id}-${projectCode}-${role}`} className="rounded bg-[#252525] px-2 py-1 text-xs">
                                    {projectCode}.{role}
                                  </span>
                                ))
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-xl border border-[#2f2f2f] bg-[#181818] p-5">
                <Title size={3} title="Modifier les roles" />
                <div className="grid gap-3">
                  <select
                    value={selectedUser?.id ?? 0}
                    onChange={(event) => setSelectedUserId(Number(event.target.value))}
                    className="rounded-md border border-gray-700 bg-[#202020] p-2"
                  >
                    {overview.users.map((user) => (
                      <option key={user.id} value={user.id}>{user.username} - {user.email}</option>
                    ))}
                  </select>
                  <select
                    value={selectedAssignmentProject?.code ?? "core"}
                    onChange={(event) => setSelectedProjectCode(event.target.value)}
                    className="rounded-md border border-gray-700 bg-[#202020] p-2"
                  >
                    {activeProjects.map((project) => (
                      <option key={project.id} value={project.code}>{project.name}</option>
                    ))}
                  </select>
                  <div className="rounded-lg border border-[#2f2f2f] p-3">
                    <p className="mb-2 text-sm text-gray-300">Roles disponibles</p>
                    <div className="grid gap-2">
                      {(selectedAssignmentProject?.roles ?? []).map((role) => (
                        <label key={role.id} className="flex items-start gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={selectedRoleKeys.includes(role.role_key)}
                            disabled={!role.is_active}
                            onChange={() => toggleRoleKey(role.role_key)}
                          />
                          <span>
                            <strong>{role.label}</strong>
                            {role.description ? <span className="block text-gray-400">{role.description}</span> : null}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <button disabled={saving} type="button" onClick={saveUserRoles} className="rounded-md bg-indigo-600 px-3 py-2 transition hover:bg-indigo-500 disabled:opacity-60">
                    Enregistrer les roles
                  </button>
                </div>
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
};

export default CoreAccess;
