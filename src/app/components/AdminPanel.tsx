import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { LogIn, LogOut, Plus, Edit, Trash2, X } from "lucide-react";
import { supabase, api, SeaCreature } from "../../utils/supabase";
import { localStorageAPI } from "../../utils/localStorage";
import { toast } from "sonner";

export function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [useLocalMode, setUseLocalMode] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creatures, setCreatures] = useState<SeaCreature[]>([]);
  const [editingCreature, setEditingCreature] = useState<SeaCreature | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    depth: "",
    description: "",
    imageUrl: ""
  });

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadCreatures();
    }
  }, [isLoggedIn, useLocalMode]);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      setAccessToken(session.access_token);
      setIsLoggedIn(true);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.session?.access_token) {
        setAccessToken(data.session.access_token);
        setIsLoggedIn(true);
        toast.success("Login berhasil!");
      }
    } catch (error: any) {
      toast.error(error.message || "Login gagal");
    }
  };

  const handleLogout = async () => {
    if (!useLocalMode) {
      await supabase.auth.signOut();
    }
    setIsLoggedIn(false);
    setUseLocalMode(false);
    setAccessToken("");
    setEmail("");
    setPassword("");
    toast.success(useLocalMode ? "Keluar dari mode lokal" : "Logout berhasil");
  };

  const loadCreatures = async () => {
    try {
      if (useLocalMode) {
        const data = localStorageAPI.getCreatures();
        setCreatures(data);
      } else {
        const data = await api.getCreatures();
        setCreatures(data);
      }
    } catch (error: any) {
      console.error("Failed to load, switching to local mode:", error);
      setUseLocalMode(true);
      const data = localStorageAPI.getCreatures();
      setCreatures(data);
    }
  };

  const buildCreaturePayload = () => ({
    name: formData.name,
    depth: Number(formData.depth),
    description: formData.description,
    imageUrl: formData.imageUrl,
  });

  const handleEnterLocalMode = () => {
    setUseLocalMode(true);
    setIsLoggedIn(true);
    toast.success("Mode lokal diaktifkan");
    loadCreatures();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const creaturePayload = buildCreaturePayload();

    try {
      if (useLocalMode) {
        if (editingCreature) {
          localStorageAPI.updateCreature(editingCreature.id, creaturePayload);
          toast.success("Data berhasil diupdate");
        } else {
          localStorageAPI.addCreature(creaturePayload);
          toast.success("Data berhasil ditambahkan");
        }
      } else {
        if (editingCreature) {
          await api.updateCreature(editingCreature.id, creaturePayload, accessToken);
          toast.success("Data berhasil diupdate");
        } else {
          await api.createCreature(creaturePayload, accessToken);
          toast.success("Data berhasil ditambahkan");
        }
      }
      resetForm();
      loadCreatures();
    } catch (error: any) {
      toast.error(error.message || "Operasi gagal");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    try {
      if (useLocalMode) {
        localStorageAPI.deleteCreature(id);
        toast.success("Data berhasil dihapus");
      } else {
        await api.deleteCreature(id, accessToken);
        toast.success("Data berhasil dihapus");
      }
      loadCreatures();
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", depth: "", description: "", imageUrl: "" });
    setEditingCreature(null);
  };

  const startEdit = (creature: SeaCreature) => {
    setEditingCreature(creature);
    setFormData({
      name: creature.name,
      depth: creature.depth.toString(),
      description: creature.description,
      imageUrl: creature.imageUrl
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-8 left-1/2 -translate-x-1/2 z-50 inline-flex items-center gap-2 rounded-full border border-white/30 bg-sky-300/55 px-5 py-3 text-white shadow-[0_10px_30px_rgba(255,255,255,0.15)] backdrop-blur-md transition-all hover:bg-sky-300/70 hover:shadow-[0_14px_40px_rgba(255,255,255,0.2)]"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
        <span className="text-base font-semibold tracking-wide">Login</span>
      </button>

      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            className="min-h-screen flex items-center justify-center p-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl max-w-4xl w-full p-6 md:p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {isLoggedIn ? "Admin Panel" : "Login Admin"}
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {!isLoggedIn ? (
                <div>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-white/80 mb-2">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 mb-2">Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 font-semibold transition-colors"
                    >
                      Login
                    </button>
                  </form>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-slate-900 text-white/60">atau</span>
                    </div>
                  </div>

                  <button
                    onClick={handleEnterLocalMode}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white rounded-lg px-6 py-3 font-semibold transition-colors"
                  >
                    Gunakan Mode Lokal (Tanpa Login)
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {editingCreature ? "Edit Hewan Laut" : "Tambah Hewan Laut"}
                      </h3>
                      {useLocalMode && (
                        <p className="text-sm text-yellow-400 mt-1">Mode Lokal Aktif</p>
                      )}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      {useLocalMode ? "Keluar" : "Logout"}
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/80 mb-2">Nama</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 mb-2">Kedalaman (meter)</label>
                        <input
                          type="number"
                          value={formData.depth}
                          onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
                          className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/80 mb-2">URL Gambar</label>
                      <input
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 mb-2">Deskripsi</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                        required
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        {editingCreature ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        {editingCreature ? "Update" : "Tambah"}
                      </button>
                      {editingCreature && (
                        <button
                          type="button"
                          onClick={resetForm}
                          className="bg-slate-700 hover:bg-slate-600 text-white rounded-lg px-6 py-3 font-semibold transition-colors"
                        >
                          Batal
                        </button>
                      )}
                    </div>
                  </form>

                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-white mb-4">Daftar Hewan Laut</h3>
                    <div className="space-y-3 max-h-96 overflow-auto">
                      {creatures.map((creature) => (
                        <div
                          key={creature.id}
                          className="bg-slate-700/50 rounded-lg p-4 flex items-center gap-4"
                        >
                          <img
                            src={creature.imageUrl}
                            alt={creature.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="text-white font-semibold">{creature.name}</h4>
                            <p className="text-white/60 text-sm">{creature.depth}m</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(creature)}
                              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2 transition-colors"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(creature.id)}
                              className="bg-red-600 hover:bg-red-700 text-white rounded-lg p-2 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
