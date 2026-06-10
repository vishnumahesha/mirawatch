export default function PerformanceCards() {
  return (
    <section id="track-record" className="py-24 px-4 bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Performance You Can Verify
          </h2>
          <p className="text-slate-500">Real results from real accounts — not back-tested hypotheticals.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Historical Performance */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Historical Performance</h3>
            <p className="text-sm text-slate-500 mb-5">OmniFunds portfolio vs. S&P 500 benchmark</p>

            <svg viewBox="0 0 380 180" className="w-full mb-4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1D4ED8" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              {[30, 70, 110, 150].map((y) => (
                <line key={y} x1="0" y1={y} x2="380" y2={y} stroke="#f1f5f9" strokeWidth="1" />
              ))}
              {/* Area fill for portfolio */}
              <path
                d="M0,165 L40,148 L80,132 L120,112 L160,88 L200,68 L240,52 L280,36 L320,22 L360,10 L380,8 L380,180 L0,180Z"
                fill="url(#perfGrad)"
              />
              {/* Portfolio line (blue) */}
              <polyline
                points="0,165 40,148 80,132 120,112 160,88 200,68 240,52 280,36 320,22 360,10 380,8"
                stroke="#1D4ED8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Benchmark line (gray) */}
              <polyline
                points="0,165 40,158 80,152 120,146 160,140 200,135 240,130 280,126 320,122 360,118 380,116"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="6 3"
              />
              <circle cx="380" cy="8" r="4" fill="#1D4ED8" />
              <circle cx="380" cy="116" r="4" fill="#94a3b8" />
            </svg>

            <div className="flex gap-4 text-xs text-slate-500 mb-5">
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-[#1D4ED8] inline-block" /> OmniFunds
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 border-t-2 border-dashed border-slate-400 inline-block" /> S&P 500
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 bg-slate-50 rounded-xl p-4 text-center">
              {[
                { label: 'Period', value: '1 yr' },
                { label: 'Total Return', value: '72.2%' },
                { label: 'Max Drawdown', value: '6.0%' },
                { label: 'Calmar', value: '12.0' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-[11px] text-slate-400 mb-0.5">{stat.label}</p>
                  <p className="text-sm font-bold text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Selective Stock Switching */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Selective Stock Switching</h3>
            <p className="text-sm text-slate-500 mb-5">Always on the leading stock — never stuck in a laggard</p>

            <svg viewBox="0 0 380 180" className="w-full mb-4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="bGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              {[40, 80, 120, 160].map((y) => (
                <line key={y} x1="0" y1={y} x2="380" y2={y} stroke="#f1f5f9" strokeWidth="1" />
              ))}
              {/* Stock A area */}
              <path d="M0,155 L60,80 L120,60 L130,90 L190,100 L200,50 L260,30 L270,80 L330,70 L380,50 L380,180 L0,180Z" fill="url(#aGrad)" />
              <polyline points="0,155 60,80 120,60 130,90 190,100 200,50 260,30 270,80 330,70 380,50" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {/* Stock B line */}
              <polyline points="0,50 60,100 120,110 130,80 190,70 200,105 260,110 270,65 330,80 380,95" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 3" />
              {/* Switch vertical markers */}
              {[130, 200, 270].map((x) => (
                <line key={x} x1={x} y1="0" x2={x} y2="180" stroke="#1D4ED8" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
              ))}
              {/* Labels */}
              <text x="60" y="25" fill="#10b981" fontSize="9" textAnchor="middle" fontWeight="bold">Invested in A</text>
              <text x="165" y="25" fill="#f59e0b" fontSize="9" textAnchor="middle" fontWeight="bold">Invested in B</text>
              <text x="230" y="25" fill="#10b981" fontSize="9" textAnchor="middle" fontWeight="bold">Invested in A</text>
              <text x="320" y="25" fill="#f59e0b" fontSize="9" textAnchor="middle" fontWeight="bold">Invested in B</text>
            </svg>

            <div className="flex gap-4 text-xs text-slate-500 mb-5">
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-emerald-500 inline-block" /> Stock A
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 border-t-2 border-dashed border-amber-400 inline-block" /> Stock B
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 border-t-2 border-dashed border-[#1D4ED8] inline-block opacity-50" /> Switch signal
              </span>
            </div>

            <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-4">
              <p className="text-sm text-[#1D4ED8] font-medium">
                OmniFunds continuously monitors and switches to whichever stock shows the highest
                upward probability — capturing momentum while shedding laggards.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom cards: Track Record + Live Demo */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#eff6ff] rounded-xl flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">30-Year Track Record</h3>
            </div>
            <p className="text-slate-600 leading-relaxed mb-4">
              Nirvana is an established company founded in 1987. We began developing automated
              trading systems in 2017, combining decades of market expertise with modern machine
              learning techniques.
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              {['Founded 1987 in Scottsdale, AZ', 'Serving 10,000+ active users', 'Live trade results auditable on request', 'OmniTrader & VisualTrader flagship products'].map(i => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8] shrink-0" />
                  {i}
                </li>
              ))}
            </ul>
          </div>

          <div id="demo" className="bg-[#1D4ED8] rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Live Account Demo</h3>
              <p className="text-blue-200 text-sm leading-relaxed mb-6">
                Watch OmniFunds trade in a real brokerage account. See exactly how signals are
                generated and trades are executed — no cherry-picking.
              </p>
              {/* Placeholder video thumbnail */}
              <div className="relative bg-white/10 rounded-xl overflow-hidden mb-6 aspect-video flex items-center justify-center border border-white/20">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="absolute bottom-3 left-4 text-white/60 text-xs">Preview: Live trading session</span>
              </div>
            </div>
            <a href="#demo"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#1D4ED8] font-semibold px-6 py-3 rounded-full text-sm transition-all hover:bg-blue-50">
              Book a Free Demo
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
