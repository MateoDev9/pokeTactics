import { TypeCalculator } from './features/typeCalculator/TypeCalculator';
import { PokemonSearcher } from './features/pokemonSearcher/PokemonSearcher';
import { TeamBuilder } from './features/teamBuilder/TeamBuilder';
import { Quiz } from './features/quiz/Quiz';
import { Versus } from './features/versus/Versus';
import { NavBar } from './components/NavBar';

function App() {
  return (
    <div className="min-h-screen pt-24 bg-slate-950 text-slate-200 p-4 md:p-8 selection:bg-purple-500/30">
      <NavBar />

      <header className="max-w-5xl mx-auto mb-10 text-center md:text-left mt-4">
        <h1 className="text-4xl md:text-5xl lg:text-5xl font-heading font-black tracking-tight mb-4 leading-tight select-none flex items-center justify-center md:justify-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-1.5 shadow-lg shadow-blue-500/20">
            <div className="w-full h-full border-4 border-white/20 rounded-full" />
          </div>
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-slate-100 to-slate-400 drop-shadow-sm">PokeTactics</span>
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl font-medium">
          Herramienta táctica avanzada de Pokémon. Analiza debilidades individuales, vulnerabilidades de especie y construye la cobertura defensiva perfecta.
        </p>
      </header>

      <main className="max-w-5xl mx-auto space-y-12 pb-24">

        {/* Core Sections Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          <section id="calculator" className="scroll-mt-32">
            <TypeCalculator />
          </section>
          <section id="searcher" className="scroll-mt-32">
            <PokemonSearcher />
          </section>
        </div>

        {/* Versus Section */}
        <section id="versus" className="mt-12 scroll-mt-32">
          <Versus />
        </section>

        {/* Team Builder Section */}
        <section id="builder" className="mt-12 scroll-mt-32">
          <TeamBuilder />
        </section>

        {/* Quiz Section */}
        <section id="quiz" className="mt-12 scroll-mt-32">
          <Quiz />
        </section>

      </main>

    </div>
  );
}

export default App;
