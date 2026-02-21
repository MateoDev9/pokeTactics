import { create } from 'zustand';
import type { PokemonType } from '../../types';

export interface TeamMember {
    id: string;
    name: string;
    types: PokemonType[];
    image: string;
}

interface TeamState {
    team: TeamMember[];
    addMember: (member: Omit<TeamMember, 'id'>) => void;
    removeMember: (id: string) => void;
}

export const useTeamStore = create<TeamState>((set) => ({
    team: [],
    addMember: (member) => set((state) => {
        if (state.team.length >= 6) return state;
        return {
            team: [...state.team, { ...member, id: crypto.randomUUID() }]
        };
    }),
    removeMember: (id) => set((state) => ({
        team: state.team.filter(m => m.id !== id)
    }))
}));
