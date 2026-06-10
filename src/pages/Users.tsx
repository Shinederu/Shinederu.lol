import Title from "@/components/decoration/Title";
import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from "@/shared/auth/constraints";
import { AuthContext } from "@/shared/context/AuthContext";
import { ModalContext } from "@/shared/context/ModalContext";
import { DateTimeFormatter } from "@/utils/DateTimeFormatter";
import { useAuth } from "@shinederu/auth-react";
import { Ban, Camera, RefreshCw, Save, Search, Settings, ShieldCheck, UserCheck, UsersRound } from "lucide-react";
import { Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";

type ProjectAccess = {
  is_global_admin: boolean;
  roles: Record<string, string[]>;
};

type AdminUser = {
  id: number;
  username: string;
  email: string;
  avatar_url: string;
  email_verified: boolean;
  is_banned: boolean;
  banned_at: string;
  banned_by_user_id: number;
  ban_reason: string;
  is_admin: boolean;
  role: "admin" | "user";
  created_at: string;
  project_access: ProjectAccess;
};

type FilterKey = "all" | "verified" | "pending" | "blocked" | "super_admin";

const PROJECT_LABELS: Record<string, string> = {
  core: "Core",
  auth: "Auth",
  main: "Main",
  melodyquest: "MelodyQuest",
  box: "ShinedeBox",
  wake: "ShinedeWake",
};

const toBool = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  const v = String(value).trim().toLowerCase();
  return ["1", "true", "yes", "on", "admin"].includes(v);
};

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object";

const parseRoleMap = (value: unknown): Record<string, string[]> => {
  if (!isRecord(value)) return {};

  return Object.entries(value).reduce<Record<string, string[]>>((roles, [projectCode, projectRoles]) => {
    if (!Array.isArray(projectRoles)) return roles;
    roles[projectCode] = projectRoles.map((role) => String(role)).filter(Boolean);
    return roles;
  }, {});
};

const getUsersFromResponse = (data: unknown): AdminUser[] => {
  if (!isRecord(data)) return [];
  const container = isRecord(data.data) ? data.data : data;
  const users = container.users;
  if (!Array.isArray(users)) return [];

  return users
    .filter(isRecord)
    .map((entry) => {
      const projectAccess = isRecord(entry.project_access) ? entry.project_access : {};
      const isAdmin = toBool(entry.is_admin) || entry.role === "admin" || toBool(projectAccess.is_global_admin);
      const role: "admin" | "user" = isAdmin ? "admin" : "user";

      return {
        id: Number(entry.id ?? 0),
        username: String(entry.username ?? ""),
        email: String(entry.email ?? ""),
        avatar_url: String(entry.avatar_url ?? ""),
        email_verified: toBool(entry.email_verified),
        is_banned: toBool(entry.is_banned),
        banned_at: String(entry.banned_at ?? ""),
        banned_by_user_id: Number(entry.banned_by_user_id ?? 0),
        ban_reason: String(entry.ban_reason ?? ""),
        is_admin: isAdmin,
        role,
        created_at: String(entry.created_at ?? ""),
        project_access: {
          is_global_admin: toBool(projectAccess.is_global_admin),
          roles: parseRoleMap(projectAccess.roles),
        },
      };
    })
    .filter((entry) => entry.id > 0);
};

const getUserFromResponse = (data: unknown): AdminUser | null => {
  if (!isRecord(data)) return null;
  const container = isRecord(data.data) ? data.data : data;
  const user = container.user;

  return getUsersFromResponse({ users: user ? [user] : [] })[0] ?? null;
};

const getAccessChips = (user: AdminUser): string[] => {
  const chips = new Set<string>();

  if (user.project_access.is_global_admin || user.is_admin) {
    chips.add("core.super_admin");
  }

  Object.entries(user.project_access.roles).forEach(([projectCode, roles]) => {
    roles.forEach((role) => {
      if (role) chips.add(`${projectCode}.${role}`);
    });
  });

  return [...chips].sort((a, b) => a.localeCompare(b));
};

const getProjectLabel = (chip: string) => {
  const [projectCode, ...roleParts] = chip.split(".");
  return `${PROJECT_LABELS[projectCode] ?? projectCode}.${roleParts.join(".")}`;
};

const Users = () => {
  const authCtx = useContext(AuthContext);
  const modalCtx = useContext(ModalContext);
  const auth = useAuth();
  const authRef = useRef(auth);
  const modalRef = useRef(modalCtx);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [managedUserId, setManagedUserId] = useState<number | null>(null);
  const [editedUsername, setEditedUsername] = useState("");
  const [banReason, setBanReason] = useState("");
  const [savingUserId, setSavingUserId] = useState<number | null>(null);
  const [uploadingAvatarUserId, setUploadingAvatarUserId] = useState<number | null>(null);

  useEffect(() => {
    authRef.current = auth;
  }, [auth]);

  useEffect(() => {
    modalRef.current = modalCtx;
  }, [modalCtx]);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    const response = await authRef.current.listUsers();
    if (!response.ok) {
      modalRef.current.open(response.error ?? "Erreur pendant le chargement des utilisateurs.", "error");
      setUsers([]);
      setIsLoading(false);
      return;
    }

    setUsers(getUsersFromResponse(response.data));
    setIsLoading(false);
  }, []);

  const replaceUser = (updatedUser: AdminUser | null) => {
    if (!updatedUser) return;
    setUsers((current) => current.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
    setEditedUsername(updatedUser.username);
    setBanReason(updatedUser.ban_reason);
  };

  const openManagement = (user: AdminUser) => {
    const nextId = managedUserId === user.id ? null : user.id;
    setManagedUserId(nextId);
    setEditedUsername(nextId ? user.username : "");
    setBanReason(nextId ? user.ban_reason : "");
  };

  const saveUsername = async (user: AdminUser) => {
    setSavingUserId(user.id);
    const response = await authRef.current.invoke("PUT", "updateUserAdmin", {
      userId: user.id,
      username: editedUsername.trim(),
    });
    setSavingUserId(null);

    if (!response.ok) {
      modalRef.current.open(response.error ?? "Erreur pendant la mise a jour du pseudo.", "error");
      return;
    }

    replaceUser(getUserFromResponse(response.data));
    modalRef.current.open("Pseudo mis a jour.", "result");
  };

  const toggleBan = async (user: AdminUser) => {
    const willBan = !user.is_banned;
    if (willBan) {
      const confirmed = await modalRef.current.open("Bloquer ce compte ?", "confirm", user.username);
      if (!confirmed) return;
    }

    setSavingUserId(user.id);
    const response = await authRef.current.invoke("PUT", "updateUserAdmin", {
      userId: user.id,
      is_banned: willBan,
      ban_reason: willBan ? banReason.trim() : "",
    });
    setSavingUserId(null);

    if (!response.ok) {
      modalRef.current.open(response.error ?? "Erreur pendant la mise a jour du blocage.", "error");
      return;
    }

    replaceUser(getUserFromResponse(response.data));
    modalRef.current.open(willBan ? "Compte bloque." : "Compte debloque.", "result");
  };

  const updateAvatar = async (user: AdminUser, file: File | null | undefined) => {
    if (!file) return;

    const payload = new FormData();
    payload.append("user_id", String(user.id));
    payload.append("file", file, file.name);

    setUploadingAvatarUserId(user.id);
    const response = await authRef.current.invoke("POST", "updateUserAvatarAdmin", payload);
    setUploadingAvatarUserId(null);

    if (!response.ok) {
      modalRef.current.open(response.error ?? "Erreur pendant la mise a jour de l'avatar.", "error");
      return;
    }

    replaceUser(getUserFromResponse(response.data));
    modalRef.current.open("Avatar mis a jour.", "result");
  };

  useEffect(() => {
    if (!authCtx.can_manage_users) return;
    void loadUsers();
  }, [authCtx.can_manage_users, loadUsers]);

  const stats = useMemo(() => {
    const verified = users.filter((user) => user.email_verified).length;
    const blocked = users.filter((user) => user.is_banned).length;
    const superAdmins = users.filter((user) => user.is_admin || user.project_access.is_global_admin).length;
    const latestUser = users.reduce<AdminUser | null>((latest, user) => {
      if (!latest) return user;
      return new Date(user.created_at).getTime() > new Date(latest.created_at).getTime() ? user : latest;
    }, null);

    return {
      total: users.length,
      verified,
      pending: users.length - verified,
      blocked,
      superAdmins,
      latestUser,
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    const needle = search.trim().toLowerCase();

    return users.filter((user) => {
      const chips = getAccessChips(user);
      const matchesSearch =
        needle === "" ||
        user.username.toLowerCase().includes(needle) ||
        user.email.toLowerCase().includes(needle) ||
        user.ban_reason.toLowerCase().includes(needle) ||
        String(user.id).includes(needle) ||
        chips.some((chip) => chip.toLowerCase().includes(needle));

      if (!matchesSearch) return false;
      if (filter === "verified") return user.email_verified;
      if (filter === "pending") return !user.email_verified;
      if (filter === "blocked") return user.is_banned;
      if (filter === "super_admin") return user.is_admin || user.project_access.is_global_admin;
      return true;
    });
  }, [filter, search, users]);

  if (!authCtx.can_manage_users) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="w-full text-left">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Title size={1} title="Utilisateurs" />
          <p className="mt-2 text-gray-300">Annuaire des comptes, etat email et acces projet.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void loadUsers()}
            className="inline-flex items-center gap-2 rounded-md bg-[#252525] px-3 py-2 text-sm transition hover:bg-[#303030]"
          >
            <RefreshCw size={16} />
            Recharger
          </button>
          {authCtx.is_admin ? (
            <Link
              to="/permissions"
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm transition hover:bg-indigo-500"
            >
              <ShieldCheck size={16} />
              Permissions
            </Link>
          ) : null}
        </div>
      </div>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-[#2f2f2f] bg-[#181818] p-4">
          <p className="text-sm text-gray-400">Comptes</p>
          <p className="mt-2 flex items-center gap-2 text-3xl font-bold">
            <UsersRound size={24} />
            {stats.total}
          </p>
        </div>
        <div className="rounded-lg border border-[#2f2f2f] bg-[#181818] p-4">
          <p className="text-sm text-gray-400">Emails verifies</p>
          <p className="mt-2 flex items-center gap-2 text-3xl font-bold text-green-300">
            <UserCheck size={24} />
            {stats.verified}
          </p>
        </div>
        <div className="rounded-lg border border-[#2f2f2f] bg-[#181818] p-4">
          <p className="text-sm text-gray-400">Comptes bloques</p>
          <p className="mt-2 flex items-center gap-2 text-3xl font-bold text-red-300">
            <Ban size={24} />
            {stats.blocked}
          </p>
        </div>
        <div className="rounded-lg border border-[#2f2f2f] bg-[#181818] p-4">
          <p className="text-sm text-gray-400">Super-admins</p>
          <p className="mt-2 text-3xl font-bold text-indigo-300">{stats.superAdmins}</p>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-[#2f2f2f] bg-[#181818] p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher par pseudo, email, ID ou role"
              className="w-full rounded-md border border-gray-700 bg-[#202020] py-2 pl-10 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {([
              ["all", "Tous"],
              ["verified", "Verifies"],
              ["pending", "En attente"],
              ["blocked", "Bloques"],
              ["super_admin", "Super-admins"],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-md px-3 py-2 text-sm transition ${filter === key ? "bg-indigo-600" : "bg-[#252525] hover:bg-[#303030]"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {stats.latestUser ? (
          <p className="mt-3 text-sm text-gray-400">
            Dernier compte: <span className="text-gray-200">{stats.latestUser.username}</span>, cree le {DateTimeFormatter(stats.latestUser.created_at)}
          </p>
        ) : null}
      </section>

      <section className="mt-6 rounded-lg border border-[#2f2f2f] bg-[#181818] p-4 sm:p-6">
        {isLoading ? (
          <p>Chargement...</p>
        ) : filteredUsers.length === 0 ? (
          <p>Aucun utilisateur ne correspond a la recherche.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#2f2f2f] text-gray-300">
                  <th className="py-3 pr-4">Utilisateur</th>
                  <th className="py-3 pr-4">Email</th>
                  <th className="py-3 pr-4">Statut</th>
                  <th className="py-3 pr-4">Acces</th>
                  <th className="py-3 pr-4">Cree le</th>
                  <th className="py-3 pr-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const chips = getAccessChips(user);

                  return (
                    <Fragment key={user.id}>
                      <tr className="border-b border-[#252525] align-top">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            {user.avatar_url ? (
                              <img src={user.avatar_url} alt="" className="h-10 w-10 rounded-full border border-[#343434] object-cover" />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#343434] bg-[#252525] font-bold">
                                {user.username.charAt(0).toUpperCase() || "#"}
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-white">{user.username}</p>
                              <p className="text-xs text-gray-500">#{user.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <p className="text-gray-200">{user.email}</p>
                          <span className={`mt-1 inline-block rounded px-2 py-1 text-xs ${user.email_verified ? "bg-green-950 text-green-200" : "bg-amber-950 text-amber-200"}`}>
                            {user.email_verified ? "verifie" : "en attente"}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`inline-block rounded px-2 py-1 text-xs ${user.is_banned ? "bg-red-950 text-red-200" : "bg-green-950 text-green-200"}`}>
                            {user.is_banned ? "bloque" : "actif"}
                          </span>
                          {user.is_banned && user.banned_at ? (
                            <p className="mt-1 text-xs text-gray-500">{DateTimeFormatter(user.banned_at)}</p>
                          ) : null}
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex max-w-xl flex-wrap gap-2">
                            {chips.length > 0 ? (
                              chips.map((chip) => (
                                <span key={`${user.id}-${chip}`} className="rounded bg-[#252525] px-2 py-1 text-xs text-gray-200">
                                  {getProjectLabel(chip)}
                                </span>
                              ))
                            ) : (
                              <span className="rounded bg-[#252525] px-2 py-1 text-xs text-gray-400">Aucun role projet</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-gray-300">{DateTimeFormatter(user.created_at)}</td>
                        <td className="py-3 pr-4">
                          <button
                            type="button"
                            onClick={() => openManagement(user)}
                            className="inline-flex items-center gap-2 rounded-md bg-[#252525] px-3 py-2 text-sm transition hover:bg-[#303030]"
                          >
                            <Settings size={16} />
                            Gerer
                          </button>
                        </td>
                      </tr>
                      {managedUserId === user.id ? (
                        <tr className="border-b border-[#252525]">
                          <td colSpan={6} className="bg-[#141414] px-4 py-5">
                            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)_minmax(240px,320px)]">
                              <div className="space-y-3">
                                <label className="block">
                                  <span className="mb-1 block text-sm text-gray-300">Pseudo</span>
                                  <input
                                    value={editedUsername}
                                    onChange={(event) => setEditedUsername(event.target.value)}
                                    minLength={USERNAME_MIN_LENGTH}
                                    maxLength={USERNAME_MAX_LENGTH}
                                    className="w-full rounded-md border border-gray-700 bg-[#202020] p-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  />
                                </label>
                                <div className="flex flex-wrap items-center gap-2">
                                  <button
                                    type="button"
                                    disabled={
                                      savingUserId === user.id ||
                                      editedUsername.trim() === user.username ||
                                      editedUsername.trim().length < USERNAME_MIN_LENGTH ||
                                      editedUsername.trim().length > USERNAME_MAX_LENGTH
                                    }
                                    onClick={() => void saveUsername(user)}
                                    className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm transition hover:bg-indigo-500 disabled:opacity-60"
                                  >
                                    <Save size={16} />
                                    Enregistrer pseudo
                                  </button>
                                  <span className="text-xs text-gray-500">
                                    {editedUsername.length}/{USERNAME_MAX_LENGTH}
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <p className="text-sm text-gray-300">Photo de profil</p>
                                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-[#252525] px-3 py-2 text-sm transition hover:bg-[#303030]">
                                  <Camera size={16} />
                                  {uploadingAvatarUserId === user.id ? "Envoi..." : "Changer l'avatar"}
                                  <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    disabled={uploadingAvatarUserId === user.id}
                                    onChange={(event) => {
                                      void updateAvatar(user, event.target.files?.[0]);
                                      event.currentTarget.value = "";
                                    }}
                                    className="hidden"
                                  />
                                </label>
                                <p className="text-xs text-gray-500">PNG, JPEG ou WebP - max 5 Mo.</p>
                              </div>

                              <div className="space-y-3">
                                <label className="block">
                                  <span className="mb-1 block text-sm text-gray-300">Motif de blocage</span>
                                  <textarea
                                    value={banReason}
                                    onChange={(event) => setBanReason(event.target.value)}
                                    maxLength={255}
                                    className="min-h-20 w-full rounded-md border border-gray-700 bg-[#202020] p-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="Visible uniquement dans l'administration"
                                  />
                                </label>
                                <button
                                  type="button"
                                  disabled={savingUserId === user.id}
                                  onClick={() => void toggleBan(user)}
                                  className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition disabled:opacity-60 ${
                                    user.is_banned ? "bg-green-700 hover:bg-green-600" : "bg-red-700 hover:bg-red-600"
                                  }`}
                                >
                                  <Ban size={16} />
                                  {user.is_banned ? "Debloquer le compte" : "Bloquer le compte"}
                                </button>
                                {user.is_banned && user.ban_reason ? (
                                  <p className="text-xs text-gray-400">Motif actuel: {user.ban_reason}</p>
                                ) : null}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Users;
