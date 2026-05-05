import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { OceanExplorer } from "./components/OceanExplorer";
import { api, SeaCreature as SeaCreatureType } from "../utils/supabase";
import { localStorageAPI } from "../utils/localStorage";

export default function App() {
  const [creatures, setCreatures] = useState<SeaCreatureType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useLocalStorage, setUseLocalStorage] = useState(false);

  useEffect(() => {
    checkInitialSetup();
  }, []);

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
      <OceanExplorer creatures={creatures} />
      <Toaster position="top-center" richColors />
    </>
  );
}