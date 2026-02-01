import { useState } from 'react';
import { GlassCard } from './GlassCard.jsx';
import { ModalOrDrawer } from './ModalOrDrawer.jsx';
import { ChevronRight, CheckCircle2 } from 'lucide-react';

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
              <span className="text-3xl group-hover:scale-110 transition-transform">{card.icon}</span>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-white/70">{card.summary}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-indigo-400/70 group-hover:text-indigo-400 transition-all">
              <span>Подробнее</span>
              <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
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
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
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
