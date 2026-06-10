const PRODUCTS = [
  {
    name: 'Inverse ETFs',
    badge: 'Most Popular',
    badgeColor: 'bg-[#1D4ED8] text-white',
    description:
      'Trades highly liquid NAS100, Russell 3000, and SPDR growth/momentum stocks & ETFs (max 50% per symbol), hedges bear phases with Treasury, corporate bond, gold/silver, and inverse market ETFs (no leverage), dynamically shifts cash exposure (up to 85%).',
    stats: [
      { label: 'Avg Annual CAR', value: '33.6%', color: 'text-emerald-600' },
      { label: 'Avg Annual MDD', value: '10.0%', color: 'text-slate-900' },
      { label: 'Trades/Year', value: '810', color: 'text-slate-900' },
    ],
    highlight: true,
  },
  {
    name: 'NAS100 & R3K',
    badge: 'Lower Drawdown',
    badgeColor: 'bg-slate-100 text-slate-600',
    description:
      'Trades 3–4 highly liquid stocks (max 50% per symbol) for high growth with low average drawdowns, adapts to bullish and bearish markets, executes via market-on-close.',
    stats: [
      { label: 'Annual CAR', value: '33.5%', color: 'text-emerald-600' },
      { label: 'Annual MDD', value: '7.9%', color: 'text-slate-900' },
      { label: 'Trades/Year', value: '228', color: 'text-slate-900' },
    ],
    highlight: false,
  },
  {
    name: 'AI Mixed Growth',
    badge: 'Highest Return',
    badgeColor: 'bg-purple-100 text-purple-700',
    description:
      'Trades highly liquid NAS100 and AI-list stocks with built-in drawdown protection, holds up to five positions (max 50% each), avoids earnings-date trading, executes via market-on-close.',
    stats: [
      { label: 'Annual CAR', value: '66.6%', color: 'text-emerald-600' },
      { label: 'Annual MDD', value: '14.2%', color: 'text-slate-900' },
      { label: 'Trades/Year', value: '518', color: 'text-slate-900' },
    ],
    highlight: false,
  },
]

export default function FlagshipProducts() {
  return (
    <section id="pricing" className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Our Flagship Solutions
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Choose the fund that matches your risk profile and growth objectives.
            All funds operate on the same algorithmic core.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PRODUCTS.map((product) => (
            <div
              key={product.name}
              className={`rounded-2xl border p-7 flex flex-col transition-shadow hover:shadow-lg ${
                product.highlight
                  ? 'border-[#1D4ED8] shadow-md shadow-blue-100 ring-1 ring-[#1D4ED8]/20'
                  : 'border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${product.badgeColor}`}>
                  {product.badge}
                </span>
              </div>

              <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-1">{product.description}</p>

              <div className="border-t border-slate-100 pt-5 space-y-3">
                {product.stats.map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{stat.label}</span>
                    <span className={`text-base font-bold ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>

              <a
                href="#demo"
                className={`mt-6 inline-flex items-center justify-center gap-2 text-sm font-semibold px-5 py-3 rounded-full transition-colors ${
                  product.highlight
                    ? 'bg-[#1D4ED8] text-white hover:bg-[#1e40af]'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Book a Free Demo
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          Past performance does not guarantee future results. All statistics reflect historical back-tested and live data.
        </p>
      </div>
    </section>
  )
}
