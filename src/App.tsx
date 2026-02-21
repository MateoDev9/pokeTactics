import { TypeCalculator } from './features/typeCalculator/TypeCalculator';
import { PokemonSearcher } from './features/pokemonSearcher/PokemonSearcher';
import { TeamBuilder } from './features/teamBuilder/TeamBuilder';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 selection:bg-purple-500/30">

      <header className="max-w-5xl mx-auto mb-12 text-center md:text-left mt-8">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          <span className="bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">Poke</span>
          <span className="text-slate-100">Tactics</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl">
          Herramienta táctica avanzada de Pokémon. Analiza debilidades individuales, vulnerabilidades de especie y construye la cobertura defensiva perfecta de tu equipo.
        </p>
      </header>

      <main className="max-w-5xl mx-auto space-y-12 pb-24">

        {/* Core Sections Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          <TypeCalculator />
          <PokemonSearcher />
        </div>

        {/* Team Builder Section */}
        <section className="mt-12">
          <TeamBuilder />
        </section>

      </main>

    </div>
  );
}

export default App;
