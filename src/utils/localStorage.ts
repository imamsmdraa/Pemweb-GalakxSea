import { SeaCreature } from "./supabase";

const STORAGE_KEY = "sea_creatures";

export const localStorageAPI = {
  getCreatures(): SeaCreature[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return [];
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  },

  saveCreatures(creatures: SeaCreature[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(creatures));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  },

  addCreature(creature: Omit<SeaCreature, 'id'>): SeaCreature {
    const creatures = this.getCreatures();
    const newCreature: SeaCreature = {
      ...creature,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    creatures.push(newCreature);
    this.saveCreatures(creatures);
    return newCreature;
  },

  updateCreature(id: string, updates: Partial<SeaCreature>): SeaCreature | null {
    const creatures = this.getCreatures();
    const index = creatures.findIndex(c => c.id === id);
    if (index === -1) return null;

    creatures[index] = {
      ...creatures[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveCreatures(creatures);
    return creatures[index];
  },

  deleteCreature(id: string): void {
    const creatures = this.getCreatures();
    const filtered = creatures.filter(c => c.id !== id);
    this.saveCreatures(filtered);
  }
};
