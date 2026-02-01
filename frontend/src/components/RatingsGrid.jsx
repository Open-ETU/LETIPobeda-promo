import { RankCard } from './GlassCard.jsx';

export function RatingsGrid({ cards }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <RankCard
          key={card.id}
          title={card.title}
          big={card.big}
          text={card.text}
          link={card.link}
          linkText={card.linkText}
        />
      ))}
    </div>
  );
}
