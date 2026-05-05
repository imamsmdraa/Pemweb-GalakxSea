import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { UserLogin } from "./components/UserLogin";
import { OceanExplorer } from "./components/OceanExplorer";
import { api, SeaCreature as SeaCreatureType, supabase } from "../utils/supabase";
import { localStorageAPI } from "../utils/localStorage";

export default function App() {
  const [creatures, setCreatures] = useState<SeaCreatureType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useLocalStorage, setUseLocalStorage] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    checkInitialSetup();
  }, [isLoggedIn]);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Session check failed:", error);
    }
  };

  const checkInitialSetup = async () => {
    try {
      const data = await api.getCreatures();
      const localData = localStorageAPI.getCreatures();

      if (data.length > 0) {
        setCreatures(data);
        setUseLocalStorage(false);
        return;
      }

      setCreatures(localData);
      setUseLocalStorage(true);
    } catch (error) {
      console.error("Backend not available, using localStorage:", error);
      const localData = localStorageAPI.getCreatures();
      setCreatures(localData);
      setUseLocalStorage(true);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCreatures = async () => {
    if (useLocalStorage) {
      const data = localStorageAPI.getCreatures();
      setCreatures(data);
    } else {
      try {
        const data = await api.getCreatures();
        setCreatures(data);
      } catch (error) {
        console.error("Failed to load creatures:", error);
        const localData = localStorageAPI.getCreatures();
        setCreatures(localData);
        setUseLocalStorage(true);
      }
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    loadCreatures();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCreatures([]);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#8dc9e7]">
        <div className="rounded-full border border-white/30 bg-white/20 px-6 py-3 text-white/95 shadow-lg backdrop-blur-md">
          Memuat...
        </div>
      </div>
    );
  }

  return (
    <>
      <UserLogin 
        onLoginSuccess={handleLoginSuccess} 
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
      />
      {isLoggedIn && <OceanExplorer creatures={creatures} />}
      <Toaster position="top-center" richColors />
    </>
  );
}