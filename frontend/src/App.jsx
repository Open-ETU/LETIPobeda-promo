import { ThemeProvider } from '@gravity-ui/uikit';
import { Navbar } from './components/Navbar.jsx';
import { Hero } from './components/Hero.jsx';
import { Section } from './components/Section.jsx';
import { PromoCardGrid } from './components/PromoCardGrid.jsx';
import { CommunityGrid } from './components/CommunityGrid.jsx';
import { RatingsGrid } from './components/RatingsGrid.jsx';
import { NewsFeed } from './components/NewsFeed.jsx';
import { Footer } from './components/Footer.jsx';
import {
  promoCards,
  pmiCards,
  communityCards,
  rankCards,
} from './lib/content.js';

function App() {
  return (
    <ThemeProvider theme="dark">
      <div className="min-h-screen">
        {/* Navigation */}
        <Navbar />

        {/* Hero Section */}
        <Hero />

        {/* Why LETI Section */}
        <Section
          id="why-leti"
          title="Почему ЛЭТИ — победа?"
          subtitle="Узнай, что делает наш университет особенным"
          withBlob
          blobPosition="right"
        >
          <PromoCardGrid cards={promoCards} />
        </Section>

        {/* PMI Section */}
        <Section
          id="pmi"
          title="Прикладная математика и информатика"
          subtitle="Направление подготовки с двумя сильными кафедрами"
          withBlob
          blobPosition="left"
        >
          <PromoCardGrid cards={pmiCards} />
        </Section>

        {/* Community Section */}
        <Section
          id="community"
          title="Сообщество и клубы"
          subtitle="ЛЭТИ — это не только учёба, но и яркая студенческая жизнь"
          withBlob
          blobPosition="right"
        >
          <CommunityGrid cards={communityCards} />
        </Section>

        {/* Ratings Section */}
        <Section
          id="ratings"
          title="Рейтинги и признание"
          subtitle="Официальные достижения и позиции в рейтингах"
          withBlob
          blobPosition="left"
        >
          <RatingsGrid cards={rankCards} />
        </Section>

        {/* News Section */}
        <Section
          id="news"
          title="Свежие новости ЛЭТИ"
          subtitle="Актуальные события и достижения университета"
        >
          <NewsFeed />
        </Section>

        {/* Footer */}
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;