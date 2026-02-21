import { useQuery } from '@tanstack/react-query';
import type { PokemonType } from '../../types';

interface PokeApiListResponse {
    results: { name: string; url: string }[];
}

interface PokeApiPokemonResponse {
    id: number;
    name: string;
    types: { type: { name: string } }[];
    sprites: { front_default: string; other: { 'official-artwork': { front_default: string } } };
    stats: { base_stat: number; stat: { name: string } }[];
    moves: { move: { name: string; url: string } }[];
}

export function usePokemonList() {
    return useQuery({
        queryKey: ['pokemon-list'],
        queryFn: async () => {
            const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1500');
            if (!res.ok) throw new Error('Network response was not ok');
            const data: PokeApiListResponse = await res.json();
            return data.results.map(p => p.name);
        },
        staleTime: Infinity, // List never changes during session
    });
}

export function usePokemon(name: string) {
    return useQuery({
        queryKey: ['pokemon', name],
        queryFn: async () => {
            if (!name) return null;
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
            if (!res.ok) throw new Error('Pokemon not found');
            const data: PokeApiPokemonResponse = await res.json();

            return {
                id: data.id,
                name: data.name,
                types: data.types.map(t => t.type.name as PokemonType),
                image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
                stats: data.stats.map(s => ({ name: s.stat.name, value: s.base_stat })),
                // Just map the first 8 moves as "Notable/Meta" moves for the prototype
                moves: data.moves.slice(0, 8).map(m => m.move.name.replace('-', ' '))
            };
        },
        enabled: !!name,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}
