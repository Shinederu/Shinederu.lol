import Title from "@/components/decoration/Title";
import { AuthContext } from "@/shared/context/AuthContext";
import { ModalContext } from "@/shared/context/ModalContext";
import { DateTimeFormatter } from "@/utils/DateTimeFormatter";
import { useAuth } from "@shinederu/auth-react";
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

type AdminUser = {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  role: "admin" | "user";
  created_at: string;
};

const toBool = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  const v = String(value).trim().toLowerCase();
  return ["1", "true", "yes", "on", "admin"].includes(v);
};

const getUsersFromResponse = (data: unknown): AdminUser[] => {
  if (!data || typeof data !== "object") return [];
  const root = data as Record<string, unknown>;
  const container = root.data && typeof root.data === "object" ? (root.data as Record<string, unknown>) : root;
  const users = container.users;
  if (!Array.isArray(users)) return [];

  return users
    .filter((entry): entry is Record<string, unknown> => Boolean(entry) && typeof entry === "object")
    .map((entry) => {
      const isAdmin = toBool(entry.is_admin) || entry.role === "admin";
      const role: "admin" | "user" = isAdmin ? "admin" : "user";
      return {
        id: Number(entry.id ?? 0),
        username: String(entry.username ?? ""),
        email: String(entry.email ?? ""),
        is_admin: isAdmin,
        role,
        created_at: String(entry.created_at ?? ""),
      };
    })
    .filter((entry) => entry.id > 0);
};

const Users = () => {
  const authCtx = useContext(AuthContext);
  const modalCtx = useContext(ModalContext);
  const auth = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  const loadUsers = async () => {
    setIsLoading(true);
    const response = await auth.listUsers();
    if (!response.ok) {
      modalCtx.open(response.error ?? "Erreur pendant le chargement des utilisateurs.", "error");
      setUsers([]);
      setIsLoading(false);
      return;
    }

    setUsers(getUsersFromResponse(response.data));
    setIsLoading(false);
  };

  useEffect(() => {
    if (!authCtx.is_admin) return;
    void loadUsers();
  }, [authCtx.is_admin]);

  if (!authCtx.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="w-full">
      <Title size={1} title="Utilisateurs" />
      <p className="mt-2 text-gray-300">Gestion des droits administrateurs.</p>

      <section className="mt-8 rounded-xl border border-[#2f2f2f] bg-[#181818] p-4 sm:p-6">
        {isLoading ? (
          <p>Chargement...</p>
        ) : users.length === 0 ? (
          <p>Aucun utilisateur trouve.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#2f2f2f]">
                  <th className="py-3 pr-4">ID</th>
                  <th className="py-3 pr-4">Nom</th>
                  <th className="py-3 pr-4">Email</th>
                  <th className="py-3 pr-4">Role</th>
                  <th className="py-3 pr-4">Cree le</th>
                  <th className="py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-[#252525]">
                    <td className="py-3 pr-4">#{user.id}</td>
                    <td className="py-3 pr-4">{user.username}</td>
                    <td className="py-3 pr-4">{user.email}</td>
                    <td className="py-3 pr-4">
                      <span className={user.role === "admin" ? "text-green-400" : "text-gray-300"}>{user.role}</span>
                    </td>
                    <td className="py-3 pr-4">{DateTimeFormatter(user.created_at)}</td>
                    <td className="py-3">
                      <button
                        disabled={updatingUserId === user.id}
                        onClick={async () => {
                          const nextRole: "admin" | "user" = user.role === "admin" ? "user" : "admin";
                          setUpdatingUserId(user.id);
                          const response = await auth.updateUserRole(user.id, nextRole);
                          setUpdatingUserId(null);

                          if (!response.ok) {
                            modalCtx.open(response.error ?? "Erreur pendant la mise a jour du role.", "error");
                            return;
                          }

                          setUsers((prev) =>
                            prev.map((entry) =>
                              entry.id === user.id
                                ? { ...entry, role: nextRole, is_admin: nextRole === "admin" }
                                : entry
                            )
                          );
                          await authCtx.reload();
                        }}
                        className="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 transition disabled:opacity-60"
                      >
                        {user.role === "admin" ? "Passer user" : "Passer admin"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Users;
