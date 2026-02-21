import { TypeCalculator } from './features/typeCalculator/TypeCalculator';
import { PokemonSearcher } from './features/pokemonSearcher/PokemonSearcher';
import { TeamBuilder } from './features/teamBuilder/TeamBuilder';
import { Quiz } from './features/quiz/Quiz';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 selection:bg-purple-500/30">

      <header className="max-w-5xl mx-auto mb-12 text-center md:text-left mt-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-pixel tracking-tight mb-6 leading-tight select-none">
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-amber-600 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Poke</span>
          <span className="text-slate-100 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Tactics</span>
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl font-medium">
          Herramienta táctica avanzada de Pokémon. Analiza debilidades individuales, vulnerabilidades de especie y construye la cobertura defensiva perfecta.
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

        {/* Quiz Section */}
        <section className="mt-12">
          <Quiz />
        </section>

      </main>

    </div>
  );
}

export default App;
