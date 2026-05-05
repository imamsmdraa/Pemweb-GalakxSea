import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { LogOut } from "lucide-react";
import { supabase } from "../../utils/supabase";
import { toast } from "sonner";

interface UserLoginProps {
  onLoginSuccess: () => void;
  onLogout: () => void;
  isLoggedIn: boolean;
}

export function UserLogin({ onLoginSuccess, onLogout, isLoggedIn }: UserLoginProps) {
  const [isOpen, setIsOpen] = useState(!isLoggedIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.session?.access_token) {
        toast.success("Login berhasil!");
        setEmail("");
        setPassword("");
        setIsOpen(false);
        onLoginSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || "Login gagal");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logout berhasil");
      onLogout();
      setIsOpen(true);
    } catch (error: any) {
      toast.error(error.message || "Logout gagal");
    }
  };

  if (isLoggedIn) {
    return (
      <button
        onClick={handleLogout}
        className="fixed top-8 right-8 z-50 inline-flex items-center gap-2 rounded-full border border-white/30 bg-red-500/55 px-5 py-3 text-white shadow-[0_10px_30px_rgba(255,255,255,0.15)] backdrop-blur-md transition-all hover:bg-red-500/70 hover:shadow-[0_14px_40px_rgba(255,255,255,0.2)]"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-base font-semibold tracking-wide">Logout</span>
      </button>
    );
  }

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
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl max-w-md w-full p-8 shadow-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
                Login
              </h2>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-white/80 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg px-6 py-3 font-semibold transition-colors"
                >
                  {isLoading ? "Memproses..." : "Login"}
                </button>
              </form>
            </div>
          </motion.div>
          </motion.div>
        )}
    </>
  );
}
