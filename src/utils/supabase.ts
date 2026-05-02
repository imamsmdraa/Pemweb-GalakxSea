import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-d73ebad2`;

export interface SeaCreature {
  id: string;
  name: string;
  depth: number;
  description: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export const api = {
  async getCreatures(): Promise<SeaCreature[]> {
    try {
      const response = await fetch(`${BASE_URL}/creatures`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return [];
      }

      const data = await response.json();
      return data.creatures || [];
    } catch (error) {
      console.error('Error fetching creatures:', error);
      return [];
    }
  },

  async createCreature(creature: Omit<SeaCreature, 'id'>, accessToken: string): Promise<SeaCreature> {
    const response = await fetch(`${BASE_URL}/creatures`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(creature)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.creature;
  },

  async updateCreature(id: string, creature: Partial<SeaCreature>, accessToken: string): Promise<SeaCreature> {
    const response = await fetch(`${BASE_URL}/creatures/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(creature)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.creature;
  },

  async deleteCreature(id: string, accessToken: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/creatures/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
  }
};
