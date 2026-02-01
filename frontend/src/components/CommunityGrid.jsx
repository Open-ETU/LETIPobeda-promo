import { GlassCard } from './GlassCard.jsx';
import { Sparkles } from 'lucide-react';

export function CommunityGrid({ cards }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <GlassCard
          key={card.id}
          hoverable={false}
          className={`text-center ${
            card.highlight
              ? 'ring-2 ring-indigo-500/40 bg-gradient-to-br from-indigo-950/50 to-violet-950/30'
              : ''
          }`}
        >
          <span className="text-4xl mb-4 block">{card.icon}</span>
          <h3 className="text-lg font-bold text-white mb-3">{card.title}</h3>
          <p className="text-sm text-white/70 leading-relaxed">{card.description}</p>
          {card.highlight && (
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-full">
              <Sparkles className="w-3 h-3" />
              Уникальный клуб
            </span>
          )}
        </GlassCard>
      ))}
    </div>
  );
}
