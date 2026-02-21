import type { PokemonType } from '../types';
import { TYPE_MATRIX } from '../data/typeEfficacy';

export function getDefenseMultipliers(types: PokemonType[]): Record<PokemonType, number> {
    const allTypes = Object.keys(TYPE_MATRIX) as PokemonType[];
    const multipliers: Record<PokemonType, number> = {} as Record<PokemonType, number>;

    allTypes.forEach(attackerType => {
        let multiplier = 1;
        types.forEach(defenderType => {
            multiplier *= TYPE_MATRIX[attackerType][defenderType];
        });
        multipliers[attackerType] = multiplier;
    });

    return multipliers;
}

export function analyzeDefense(types: PokemonType[]) {
    const multipliers = getDefenseMultipliers(types);

    const weaknesses: PokemonType[] = [];
    const resistances: PokemonType[] = [];
    const immunities: PokemonType[] = [];

    (Object.keys(multipliers) as PokemonType[]).forEach(type => {
        const val = multipliers[type];
        if (val > 1) {
            weaknesses.push(type);
        } else if (val === 0) {
            immunities.push(type);
        } else if (val < 1) {
            resistances.push(type);
        }
    });

    // Sort weaknesses by severity (x4 before x2)
    weaknesses.sort((a, b) => multipliers[b] - multipliers[a]);
    // Sort resistances by severity (x0.25 before x0.5)
    resistances.sort((a, b) => multipliers[a] - multipliers[b]);

    return { multipliers, weaknesses, resistances, immunities };
}

export function analyzeOffense(types: PokemonType[]) {
    const superEffective: PokemonType[] = [];
    const notVeryEffective: PokemonType[] = [];
    const noEffect: PokemonType[] = [];

    const allTypes = Object.keys(TYPE_MATRIX) as PokemonType[];

    // For offense usually we just want to know what STAB (Same Type Attack Bonus) can hit
    // If multiple types, we combine coverage (what it can hit super effectively combined)
    allTypes.forEach(defender => {
        let bestMultiplier = 0;
        types.forEach(attacker => {
            const mult = TYPE_MATRIX[attacker][defender];
            if (mult > bestMultiplier) {
                bestMultiplier = mult;
            }
        });

        if (bestMultiplier > 1) {
            superEffective.push(defender);
        } else if (bestMultiplier === 0) {
            noEffect.push(defender);
        } else if (bestMultiplier < 1) {
            notVeryEffective.push(defender);
        }
    });

    return { superEffective, notVeryEffective, noEffect };
}
