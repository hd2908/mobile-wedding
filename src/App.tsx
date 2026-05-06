import { useRef } from 'react';
import Cover from './components/Cover';
import Location from './components/Location';
import Menu from './components/Menu';
import Account from './components/Account';
import Gallery from './components/Gallery';
import Guestbook from './components/Guestbook';
import Share from './components/Share';
import { ScrollContainerContext } from './scroll-context';

export default function App() {
  const scrollRef = useRef<HTMLElement | null>(null);

  return (
    <ScrollContainerContext.Provider value={scrollRef}>
      <main className="app" ref={scrollRef}>
        <Cover />
        <Location />
        <Menu />
        <Account />
        <Gallery />
        <Guestbook />
        <Share />
      </main>
    </ScrollContainerContext.Provider>
  );
}
