'use client'

import { useState } from 'react'

const FAQS = [
  {
    q: 'What is OmniFunds?',
    a: 'OmniFunds is an algorithmic trading system that automatically manages your brokerage account using proprietary signal technology. It selects high-probability equities, shifts to defensive positions in down markets, and executes trades on your behalf via market-on-close orders.',
  },
  {
    q: 'How does OmniFunds compare to Forex algo-trading bots?',
    a: 'Unlike Forex bots, OmniFunds trades US equities and ETFs — instruments with deep liquidity and regulatory oversight. Forex bots typically use leverage and operate in largely unregulated markets with higher counterparty risk. OmniFunds uses no leverage and focuses on long-only equities with hedging via inverse ETFs.',
  },
  {
    q: 'Can I Trust OmniFunds?',
    a: 'Nirvana Systems has been in business since 1987 — nearly 40 years. We have thousands of active users, a publicly auditable track record, and we stand behind OmniFunds with a 12-month performance guarantee. You can request live account statements at any time.',
  },
  {
    q: 'Can I use it with Schwab?',
    a: 'Yes. OmniFunds is compatible with Charles Schwab, TD Ameritrade (now Schwab), and most major US brokerages that support API-based order routing. Contact us during your demo to confirm compatibility with your specific account type.',
  },
  {
    q: 'Can I see a Track Record?',
    a: 'Absolutely. We provide full historical performance data including live account results, drawdown metrics, and year-by-year returns. Book a free demo and we will walk you through the unaudited live results in detail.',
  },
  {
    q: 'How does OmniFunds compare to Robo Advisors?',
    a: 'Robo advisors typically rebalance into index funds on a calendar schedule and provide little downside protection. OmniFunds actively selects individual high-momentum stocks and can shift to cash or inverse ETFs when conditions deteriorate — giving you proactive protection that robo advisors do not offer.',
  },
  {
    q: 'Is OmniFunds a registered broker or investment advisor?',
    a: 'No. Nirvana Systems is a software and technology company. OmniFunds is a licensed trading software product. We do not provide investment advice, manage client money, or act as a broker-dealer. You retain full control of your brokerage account at all times.',
  },
  {
    q: 'What does OmniFunds cost?',
    a: 'The startup platform fee is a one-time cost. We do not charge any AUM fees or any percent of profits. The ongoing auto-trade fee calcs to about 2% per year on a small account under $50k and about 1% on a large account $1m+.',
  },
]

function FAQItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between py-5 text-left group"
      >
        <span className="text-slate-900 font-medium text-sm md:text-base pr-4 group-hover:text-[#1D4ED8] transition-colors">
          {q}
        </span>
        <span className={`shrink-0 w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center transition-all mt-0.5 ${open ? 'bg-[#1D4ED8] border-[#1D4ED8] rotate-45' : ''}`}>
          <svg width="10" height="10" viewBox="0 0 12 12" fill={open ? 'white' : '#94a3b8'}>
            <path d="M6 1v10M1 6h10" stroke={open ? 'white' : '#94a3b8'} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="pb-5 pr-8">
          <p className="text-slate-500 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500">Everything you need to know before getting started.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 md:px-8">
          {FAQS.map((faq, i) => (
            <FAQItem
              key={faq.q}
              q={faq.q}
              a={faq.a}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Still have questions?{' '}
            <a href="#demo" className="text-[#1D4ED8] font-medium hover:underline">
              Book a free demo
            </a>{' '}
            and speak with our team directly.
          </p>
        </div>
      </div>
    </section>
  )
}
