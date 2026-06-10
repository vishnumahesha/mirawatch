const TESTIMONIALS = [
  {
    name: 'Don',
    location: 'US',
    initials: 'D',
    color: 'bg-[#1D4ED8]',
    quote: 'My account is up 33% in 5 months. Service: I can always count on Scott & Nathan.',
    stars: 5,
  },
  {
    name: 'Gary Metzer',
    location: 'US',
    initials: 'GM',
    color: 'bg-emerald-600',
    quote: "Nirvana's support team is the best I have ever seen.",
    stars: 5,
  },
  {
    name: 'Dale Swanson',
    location: 'US',
    initials: 'DS',
    color: 'bg-violet-600',
    quote: 'Been with Nirvana nearly 25 years. I use OmniTrader and VisualTrader daily.',
    stars: 5,
  },
  {
    name: 'omagor moses',
    location: 'UG',
    initials: 'OM',
    color: 'bg-amber-600',
    quote: 'A Platform for Any Market Direction... 20 years in the Nirvana Family.',
    stars: 5,
  },
  {
    name: 'Barry Cowling',
    location: 'AU',
    initials: 'BC',
    color: 'bg-rose-600',
    quote: 'Love the people, very helpful and attentive.',
    stars: 5,
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 mb-3">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill="#f59e0b">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="py-24 px-4 bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Our Users Talk About Us
          </h2>
          <p className="text-slate-500">Join thousands of investors who trust Nirvana Systems.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
              <Stars count={t.stars} />
              <p className="text-slate-700 text-sm leading-relaxed flex-1 mb-5">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 ${t.color} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.location}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Summary card */}
          <div className="bg-[#1D4ED8] rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <p className="text-5xl font-bold text-white mb-1">4.9</p>
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 20 20" fill="#fbbf24">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-blue-200 text-sm">Average rating from verified users</p>
            </div>
            <p className="text-white/60 text-xs mt-6">Based on reviews from 10,000+ active Nirvana Systems members</p>
          </div>
        </div>
      </div>
    </section>
  )
}
