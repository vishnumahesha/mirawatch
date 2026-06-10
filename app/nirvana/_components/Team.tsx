const TEAM = [
  {
    name: 'Ed Downs',
    title: 'CEO & Founder',
    initials: 'ED',
    color: 'bg-[#1D4ED8]',
    bio: 'Founded Nirvana Systems in 1987. Ed has spent over 30 years developing trading technology that gives everyday investors an edge.',
  },
  {
    name: 'Jeff Drake',
    title: 'Director of Trading Technology',
    initials: 'JD',
    color: 'bg-emerald-600',
    bio: 'Oversees all algorithmic strategy development. Jeff brings deep expertise in quantitative finance and systematic trading systems.',
  },
  {
    name: 'Constantin Craus',
    title: 'CTO',
    initials: 'CC',
    color: 'bg-violet-600',
    bio: 'Leads the engineering team behind OmniFunds and OmniTrader. Constantin architects the infrastructure that powers thousands of live accounts daily.',
  },
]

export default function Team() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Our Team
          </h2>
          <p className="text-slate-500">The people behind 30 years of trading innovation.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TEAM.map((member) => (
            <div key={member.name} className="text-center">
              {/* Avatar placeholder */}
              <div className={`w-24 h-24 ${member.color} rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg`}>
                {member.initials}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-0.5">{member.name}</h3>
              <p className="text-sm text-[#1D4ED8] font-medium mb-3">{member.title}</p>
              <p className="text-sm text-slate-500 leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
