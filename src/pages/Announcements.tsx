import Title from "@/components/decoration/Title";
import { AuthContext } from "@/shared/context/AuthContext";
import { ModalContext } from "@/shared/context/ModalContext";
import { createAnnouncement, deleteAnnouncement, listAnnouncementsAdmin, updateAnnouncement } from "@/shared/mainSite/client";
import { AnnouncementType } from "@/types/Announcement";
import { DateTimeFormatter } from "@/utils/DateTimeFormatter";
import { useContext, useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";

type FormState = {
  title: string;
  message: string;
  buttonLabel: string;
  buttonLink: string;
  publishedAt: string;
};

const EMPTY_FORM: FormState = {
  title: "",
  message: "",
  buttonLabel: "",
  buttonLink: "",
  publishedAt: "",
};

const formatForInput = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const Announcements = () => {
  const authCtx = useContext(AuthContext);
  const modalCtx = useContext(ModalContext);
  const [items, setItems] = useState<AnnouncementType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const isAdmin = authCtx.is_admin;

  const loadAnnouncements = async () => {
    setLoading(true);
    const response = await listAnnouncementsAdmin();
    if (!response.ok || !response.data) {
      modalCtx.open(response.error ?? "Erreur pendant le chargement des annonces.", "error");
      setItems([]);
      setLoading(false);
      return;
    }

    setItems(response.data.announcements);
    setLoading(false);
  };

  useEffect(() => {
    if (!isAdmin) return;
    void loadAnnouncements();
  }, [isAdmin]);

  const submitLabel = useMemo(() => (editingId ? "Mettre a jour" : "Creer"), [editingId]);

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="w-full">
      <Title size={1} title="Gestion des annonces" />
      <p className="text-gray-300">Creation, edition et suppression des annonces visibles sur l'accueil.</p>

      <section className="mt-6 rounded-xl border border-[#2f2f2f] bg-[#181818] p-5 text-left">
        <Title size={3} title={editingId ? "Modifier une annonce" : "Nouvelle annonce"} />
        <div className="grid gap-3 mt-2">
          <input
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            className="p-2 border border-gray-700 rounded-md bg-[#202020] text-white"
            placeholder="Titre"
            maxLength={160}
          />

          <textarea
            value={form.message}
            onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
            className="p-2 border border-gray-700 rounded-md bg-[#202020] text-white min-h-36"
            placeholder="Texte de l'annonce"
            maxLength={5000}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={form.buttonLabel}
              onChange={(event) => setForm((prev) => ({ ...prev, buttonLabel: event.target.value }))}
              className="p-2 border border-gray-700 rounded-md bg-[#202020] text-white"
              placeholder="Libelle du bouton (optionnel)"
              maxLength={120}
            />
            <input
              value={form.buttonLink}
              onChange={(event) => setForm((prev) => ({ ...prev, buttonLink: event.target.value }))}
              className="p-2 border border-gray-700 rounded-md bg-[#202020] text-white"
              placeholder="Lien du bouton (optionnel)"
              maxLength={1024}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Date de publication</label>
            <input
              type="datetime-local"
              value={form.publishedAt}
              onChange={(event) => setForm((prev) => ({ ...prev, publishedAt: event.target.value }))}
              className="p-2 border border-gray-700 rounded-md bg-[#202020] text-white"
            />
          </div>

          <div className="flex gap-3">
            <button
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                const payload = {
                  title: form.title,
                  message: form.message,
                  buttonLabel: form.buttonLabel,
                  buttonLink: form.buttonLink,
                  publishedAt: form.publishedAt,
                };

                const response = editingId
                  ? await updateAnnouncement(editingId, payload)
                  : await createAnnouncement(payload);
                setSaving(false);

                if (!response.ok) {
                  modalCtx.open(response.error ?? "Erreur pendant l'enregistrement.", "error");
                  return;
                }

                setEditingId(null);
                setForm(EMPTY_FORM);
                await loadAnnouncements();
                modalCtx.open("Annonce enregistree.", "result");
              }}
              className="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 transition disabled:opacity-60"
            >
              {submitLabel}
            </button>

            <button
              disabled={saving}
              onClick={() => {
                setEditingId(null);
                setForm(EMPTY_FORM);
              }}
              className="px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition disabled:opacity-60"
            >
              Reinitialiser
            </button>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-[#2f2f2f] bg-[#181818] p-5 text-left">
        <Title size={3} title="Annonces existantes" />
        {loading ? (
          <p>Chargement...</p>
        ) : items.length === 0 ? (
          <p>Aucune annonce pour le moment.</p>
        ) : (
          <div className="grid gap-4">
            {items.map((announcement) => (
              <div key={announcement.id} className="rounded-lg border border-[#2f2f2f] bg-[#141414] p-4">
                <h3 className="text-xl font-bold">{announcement.title}</h3>
                <p className="text-gray-200 whitespace-pre-wrap mt-2">{announcement.message}</p>
                <p className="text-sm text-gray-400 mt-3">Publie le {DateTimeFormatter(announcement.publishedAt)}</p>
                {announcement.buttonLabel && announcement.buttonLink ? (
                  <p className="text-sm text-blue-300 mt-1">
                    Bouton: {announcement.buttonLabel} ({announcement.buttonLink})
                  </p>
                ) : null}

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => {
                      setEditingId(announcement.id);
                      setForm({
                        title: announcement.title,
                        message: announcement.message,
                        buttonLabel: announcement.buttonLabel,
                        buttonLink: announcement.buttonLink,
                        publishedAt: formatForInput(announcement.publishedAt),
                      });
                    }}
                    className="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 transition"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={async () => {
                      const confirmed = await modalCtx.open("Supprimer cette annonce ?", "confirm", announcement.title);
                      if (!confirmed) return;
                      const response = await deleteAnnouncement(announcement.id);
                      if (!response.ok) {
                        modalCtx.open(response.error ?? "Erreur pendant la suppression.", "error");
                        return;
                      }
                      await loadAnnouncements();
                      modalCtx.open("Annonce supprimee.", "result");
                    }}
                    className="px-3 py-2 rounded-md bg-red-700 hover:bg-red-600 transition"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Announcements;
