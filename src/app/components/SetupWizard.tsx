import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { sampleCreatures } from "../../utils/seedData";
import { localStorageAPI } from "../../utils/localStorage";

interface SetupWizardProps {
  onComplete: () => void;
}

export function SetupWizard({ onComplete }: SetupWizardProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(true);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d73ebad2/admin/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ email, password, name })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create admin');
      }

      toast.success("Admin berhasil dibuat!");
      setStep(2);
    } catch (error: any) {
      toast.error(error.message || "Gagal membuat admin");
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async () => {
    setLoading(true);

    try {
      if (backendAvailable) {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          `https://${projectId}.supabase.co`,
          publicAnonKey
        );

        const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (authError) throw authError;

        const accessToken = session?.access_token;
        if (!accessToken) throw new Error("No access token");

        for (const creature of sampleCreatures) {
          await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-d73ebad2/creatures`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
              },
              body: JSON.stringify(creature)
            }
          );
        }
      } else {
        for (const creature of sampleCreatures) {
          localStorageAPI.addCreature(creature);
        }
      }

      toast.success("Data sample berhasil ditambahkan!");
      setTimeout(() => {
        onComplete();
      }, 1000);
    } catch (error: any) {
      console.error("Backend seed failed, using localStorage:", error);
      setBackendAvailable(false);

      for (const creature of sampleCreatures) {
        localStorageAPI.addCreature(creature);
      }

      toast.success("Data sample berhasil ditambahkan (mode lokal)!");
      setTimeout(() => {
        onComplete();
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleSkipBackend = () => {
    setBackendAvailable(false);
    setStep(2);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-black flex items-center justify-center p-4 z-50">
      <motion.div
        className="bg-slate-900/90 backdrop-blur-sm rounded-2xl max-w-md w-full p-8 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {step === 1 ? (
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Selamat Datang!</h1>
            <p className="text-white/70 mb-4">
              Buat akun admin untuk mengelola website eksplorasi laut
            </p>
            <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-3 mb-6">
              <p className="text-yellow-200 text-sm">
                Backend Supabase belum siap. Anda bisa lanjut dengan mode lokal atau setup admin nanti.
              </p>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-white/80 mb-2">Nama</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
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
                  minLength={6}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg px-6 py-3 font-semibold transition-colors"
              >
                {loading ? "Membuat..." : "Buat Admin"}
              </button>
            </form>

            <button
              onClick={handleSkipBackend}
              className="w-full mt-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg px-6 py-3 font-semibold transition-colors"
            >
              Lewati - Gunakan Mode Lokal
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {backendAvailable ? "Admin Berhasil Dibuat!" : "Mode Lokal Aktif"}
            </h1>
            <p className="text-white/70 mb-6">
              Tambahkan data sample hewan laut untuk memulai
            </p>

            <div className="bg-slate-800 rounded-lg p-4 mb-6">
              <p className="text-white/80 text-sm">
                Akan menambahkan {sampleCreatures.length} hewan laut dengan berbagai kedalaman
              </p>
            </div>

            <button
              onClick={handleSeedData}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg px-6 py-3 font-semibold transition-colors"
            >
              {loading ? "Menambahkan Data..." : "Tambah Data Sample"}
            </button>

            <button
              onClick={onComplete}
              className="w-full mt-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg px-6 py-3 font-semibold transition-colors"
            >
              Lewati (Mulai Kosong)
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
