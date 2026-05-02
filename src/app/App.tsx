import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { AdminPanel } from "./components/AdminPanel";
import { SetupWizard } from "./components/SetupWizard";
import { OceanExplorer } from "./components/OceanExplorer";
import { api, SeaCreature as SeaCreatureType } from "../utils/supabase";
import { localStorageAPI } from "../utils/localStorage";

export default function App() {
  const [creatures, setCreatures] = useState<SeaCreatureType[]>([]);
  const [showSetup, setShowSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [useLocalStorage, setUseLocalStorage] = useState(false);

  useEffect(() => {
    checkInitialSetup();
  }, []);

  const checkInitialSetup = async () => {
    try {
      const data = await api.getCreatures();
      setCreatures(data);
      setUseLocalStorage(false);

      if (data.length === 0) {
        const localData = localStorageAPI.getCreatures();
        if (localData.length > 0) {
          setCreatures(localData);
          setUseLocalStorage(true);
        } else {
          setShowSetup(true);
        }
      }
    } catch (error) {
      console.error("Backend not available, using localStorage:", error);
      const localData = localStorageAPI.getCreatures();
      setCreatures(localData);
      setUseLocalStorage(true);

      if (localData.length === 0) {
        setShowSetup(true);
      }
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#8dc9e7]">
        <div className="rounded-full border border-white/30 bg-white/20 px-6 py-3 text-white/95 shadow-lg backdrop-blur-md">
          Memuat...
        </div>
      </div>
    );
  }

  if (showSetup) {
    return (
      <>
        <SetupWizard onComplete={() => {
          setShowSetup(false);
          loadCreatures();
        }} />
        <Toaster position="top-center" richColors />
      </>
    );
  }

  return (
    <>
      <OceanExplorer creatures={creatures} />
      <AdminPanel />
      <Toaster position="top-center" richColors />
    </>
  );
}