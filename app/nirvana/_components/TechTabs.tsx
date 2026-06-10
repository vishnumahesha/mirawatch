'use client'

import { useState } from 'react'

const TABS = [
  'Passive Pitfalls?',
  'Algo Trading Explained',
  'How OmniFunds Work',
  'Key Advantages',
  'Is It For You?',
]

const TAB_CONTENT: Record<string, React.ReactNode> = {
  'Passive Pitfalls?': (
    <div className="grid md:grid-cols-2 gap-10 items-start">
      <div>
        <h3 className="text-2xl font-bold text-slate-900 mb-4">Passive Investing: The Hidden Costs?</h3>
        <p className="text-slate-600 leading-relaxed mb-4">
          Passive &lsquo;buy and hold&rsquo; strategies expose investors to the full brunt of market
          downturns. In 2001 and 2008, markets declined by more than 50% — taking years to recover.
          Investors who simply held on watched their retirement savings cut in half.
        </p>
        <p className="text-slate-600 leading-relaxed mb-4">
          Robo-advisors promise intelligent management but typically rebalance into the same index
          funds, providing no meaningful protection when markets crash. Their performance during
          bear markets tends to mirror or underperform the benchmark they claim to beat.
        </p>
        <p className="text-slate-600 leading-relaxed">
          The uncomfortable truth: major losses are <strong className="text-slate-800">mostly avoidable</strong>.
          Algorithmic systems can identify deteriorating conditions and shift to defensive positions
          before catastrophic losses accumulate.
        </p>
      </div>
      <div className="space-y-4">
        {[
          { year: '2001', label: 'Dot-com crash', decline: '–49%', color: 'bg-red-50 border-red-200 text-red-700' },
          { year: '2008', label: 'Financial crisis', decline: '–56%', color: 'bg-red-50 border-red-200 text-red-700' },
          { year: '2020', label: 'COVID shock', decline: '–34%', color: 'bg-orange-50 border-orange-200 text-orange-700' },
        ].map((item) => (
          <div key={item.year} className={`border rounded-xl p-4 ${item.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm">{item.year} — {item.label}</p>
                <p className="text-xs opacity-75 mt-0.5">S&amp;P 500 peak-to-trough</p>
              </div>
              <span className="text-2xl font-bold">{item.decline}</span>
            </div>
          </div>
        ))}
        <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-4">
          <p className="text-[#1D4ED8] text-sm font-semibold">With OmniFunds algorithmic protection, max drawdown averaged just 10%.</p>
        </div>
      </div>
    </div>
  ),
  'Algo Trading Explained': (
    <div className="max-w-3xl">
      <h3 className="text-2xl font-bold text-slate-900 mb-4">What Is Algorithmic Trading?</h3>
      <p className="text-slate-600 leading-relaxed mb-4">
        Algorithmic trading uses computer programs to execute trades based on pre-defined rules
        and mathematical models — eliminating emotion and human delay from investment decisions.
        Our systems analyze hundreds of variables simultaneously to identify optimal entry and exit points.
      </p>
      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        {['Speed', 'Consistency', 'Discipline'].map((item) => (
          <div key={item} className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
            <p className="font-bold text-slate-900 mb-1">{item}</p>
            <p className="text-xs text-slate-500">Algorithm never hesitates, second-guesses, or panics.</p>
          </div>
        ))}
      </div>
    </div>
  ),
  'How OmniFunds Work': (
    <div className="max-w-3xl">
      <h3 className="text-2xl font-bold text-slate-900 mb-6">Four Steps to Smarter Returns</h3>
      <div className="space-y-4">
        {[
          { step: '01', title: 'Screen the universe', desc: 'Daily scan of NAS100, Russell 3000, and momentum ETFs.' },
          { step: '02', title: 'Rank by probability', desc: 'Each candidate is scored by upward movement likelihood and risk metrics.' },
          { step: '03', title: 'Execute at close', desc: 'Trades placed at market-on-close to minimize slippage.' },
          { step: '04', title: 'Hedge on signals', desc: 'Bear signals trigger shift into treasuries, gold, and inverse ETFs.' },
        ].map((item) => (
          <div key={item.step} className="flex gap-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <span className="text-3xl font-bold text-[#bfdbfe] shrink-0 w-10">{item.step}</span>
            <div>
              <p className="font-semibold text-slate-900">{item.title}</p>
              <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
  'Key Advantages': (
    <div className="max-w-3xl">
      <h3 className="text-2xl font-bold text-slate-900 mb-6">Why OmniFunds Outperforms</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          'No leverage — capital is never amplified beyond 1:1',
          'Dynamic cash allocation up to 85% during downturns',
          'Avoids earnings-date risk by design',
          'No AUM fees — aligned incentives with investors',
          '30+ year track record on real accounts',
          '12-month performance guarantee — unique in the industry',
        ].map((item) => (
          <div key={item} className="flex gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="#10b981" className="shrink-0 mt-0.5">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-slate-700">{item}</p>
          </div>
        ))}
      </div>
    </div>
  ),
  'Is It For You?': (
    <div className="max-w-3xl">
      <h3 className="text-2xl font-bold text-slate-900 mb-4">Is OmniFunds Right for You?</h3>
      <p className="text-slate-600 leading-relaxed mb-6">
        OmniFunds works best for investors who have a brokerage account (TD Ameritrade, Schwab, etc.),
        are tired of watching gains evaporate in corrections, and want a systematic alternative to
        guesswork investing.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="font-semibold text-emerald-800 mb-3 text-sm uppercase tracking-wide">Good fit if you...</p>
          {['Have $25k+ to invest', 'Use a US brokerage', 'Want hands-off automation', 'Think long-term (1yr+)'].map(i => (
            <p key={i} className="text-sm text-emerald-700 flex gap-2 mb-1">✓ {i}</p>
          ))}
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="font-semibold text-slate-600 mb-3 text-sm uppercase tracking-wide">Not ideal if you...</p>
          {['Trade options or futures', 'Need daily liquidity', 'Prefer Forex or crypto', 'Want manual control'].map(i => (
            <p key={i} className="text-sm text-slate-500 flex gap-2 mb-1">— {i}</p>
          ))}
        </div>
      </div>
    </div>
  ),
}

export default function TechTabs() {
  const [active, setActive] = useState(TABS[0])

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Explore Our Technology
          </h2>
          <p className="text-slate-500">Everything you need to know about how algorithmic trading works for you.</p>
        </div>

        {/* Tab bar */}
        <div className="flex overflow-x-auto gap-1 bg-slate-100 rounded-2xl p-1.5 mb-8 scrollbar-none">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                active === tab
                  ? 'bg-white text-[#1D4ED8] shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-[#f8fafc] rounded-2xl border border-slate-200 p-8 md:p-10 min-h-[340px]">
          {TAB_CONTENT[active]}
        </div>
      </div>
    </section>
  )
}
