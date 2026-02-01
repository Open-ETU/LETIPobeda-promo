import { GlassCard } from './GlassCard.jsx';

export function CommunityGrid({ cards }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <GlassCard
          key={card.id}
          hoverable={false}
          className={`text-center ${
            card.highlight
              ? 'ring-2 ring-indigo-500/50 bg-indigo-950/30'
              : ''
          }`}
        >
          <span className="text-4xl mb-4 block">{card.icon}</span>
          <h3 className="text-lg font-bold text-white mb-3">{card.title}</h3>
          <p className="text-sm text-white/70">{card.description}</p>
          {card.highlight && (
            <span className="mt-4 inline-block text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full">
              Уникальный клуб
            </span>
          )}
        </GlassCard>
      ))}
    </div>
  );
}
