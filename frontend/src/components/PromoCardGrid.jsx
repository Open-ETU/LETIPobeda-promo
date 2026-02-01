import { useState } from 'react';
import { GlassCard } from './GlassCard.jsx';
import { ModalOrDrawer } from './ModalOrDrawer.jsx';

export function PromoCardGrid({ cards }) {
  const [selectedCard, setSelectedCard] = useState(null);

  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <GlassCard
            key={card.id}
            onClick={() => setSelectedCard(card)}
            className="group"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">{card.icon}</span>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-white/70">{card.summary}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-indigo-400/70 group-hover:text-indigo-400 transition-colors">
              Нажми, чтобы подробнее →
            </p>
          </GlassCard>
        ))}
      </div>

      <ModalOrDrawer
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        title={selectedCard?.title || ''}
      >
        {selectedCard && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">{selectedCard.icon}</span>
              <p className="text-lg text-white/70">{selectedCard.summary}</p>
            </div>
            <ul className="space-y-4">
              {selectedCard.details.map((detail, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                  <p className="text-white/80">{detail}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </ModalOrDrawer>
    </>
  );
}
