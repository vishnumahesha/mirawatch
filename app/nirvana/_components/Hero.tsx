export default function Hero() {
  return (
    <>
      {/* Hero 1 */}
      <section id="top" className="relative overflow-hidden bg-white pt-20 pb-24 px-4">
        {/* Decorative blobs */}
        <div className="absolute top-20 -left-40 w-[500px] h-[500px] bg-[#e0e7ff] rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute top-40 right-0 w-96 h-96 bg-[#d1fae5] rounded-full blur-3xl opacity-35 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#dbeafe] rounded-full blur-3xl opacity-30 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#eff6ff] border border-[#bfdbfe] text-[#1D4ED8] text-xs font-semibold px-4 py-2 rounded-full mb-8 tracking-wide uppercase">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            12-Month Performance Guarantee
          </div>

          <h1
            className="text-5xl md:text-6xl lg:text-[4.25rem] font-bold text-slate-900 leading-[1.1] tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Generate Intelligent Alpha:{' '}
            <span className="text-[#1D4ED8]">Algorithmic Equities Trading</span>{' '}
            That Thinks Ahead.
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Nirvana Systems provides powerful algorithmic trading solutions for equities,
            backed by over 30 years of experience.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a href="#demo"
              className="inline-flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1e40af] text-white font-semibold px-8 py-4 rounded-full text-base transition-colors shadow-lg shadow-blue-500/20">
              Book a Free Demo
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#track-record" className="text-slate-500 hover:text-[#1D4ED8] text-sm font-medium transition-colors underline underline-offset-4">
              View track record
            </a>
          </div>

          {/* Featured In */}
          <div className="border-t border-slate-100 pt-10">
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-6 font-medium">Featured In</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {['Dow Jones', 'Nasdaq', 'NYSE', 'CNBC'].map((name) => (
                <span key={name} className="text-slate-400 font-semibold text-sm md:text-base tracking-wide hover:text-slate-600 transition-colors cursor-default">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hero 2 */}
      <section className="bg-[#f8fafc] py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-[#1D4ED8] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-6">
                OmniFunds
              </span>
              <h2
                className="text-4xl md:text-5xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-6"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Beyond &lsquo;Buy &amp; Hold&rsquo;:{' '}
                <span className="text-[#1D4ED8]">Maximize Growth &amp; Shield Your Wealth</span>{' '}
                in Any Market.
              </h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                OmniFunds is an algorithmic trading solution for your brokerage that dynamically shifts
                your investments into stocks that have the highest probability of upward price movement
                and preserves your assets during market downturns.
              </p>
              <blockquote className="border-l-4 border-[#1D4ED8] pl-4 text-slate-600 italic mb-8 leading-relaxed">
                Think of it like always having your money on the leading horse in a race.
              </blockquote>
              <a href="#demo"
                className="inline-flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1e40af] text-white font-semibold px-8 py-4 rounded-full text-base transition-colors shadow-lg shadow-blue-500/20">
                Book a Free Demo
              </a>
            </div>

            {/* Visual element */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-xs text-slate-400 ml-2">OmniFunds Portfolio</span>
                </div>
                <svg viewBox="0 0 360 160" className="w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="h2grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1D4ED8" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,150 L30,138 L60,122 L90,105 L120,95 L150,78 L180,60 L210,48 L240,38 L270,28 L300,18 L330,10 L360,5 L360,160 L0,160Z" fill="url(#h2grad)" />
                  <polyline points="0,150 30,138 60,122 90,105 120,95 150,78 180,60 210,48 240,38 270,28 300,18 330,10 360,5" stroke="#1D4ED8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="360" cy="5" r="4" fill="#1D4ED8" />
                </svg>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-slate-400">12 months ago</span>
                  <span className="text-sm font-bold text-emerald-600">+72.2%</span>
                  <span className="text-xs text-slate-400">Today</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#1D4ED8] text-white rounded-xl px-4 py-3 shadow-lg">
                <p className="text-xs opacity-75">Annual Return</p>
                <p className="text-xl font-bold">33.6%</p>
                <p className="text-xs opacity-75">avg CAR</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
