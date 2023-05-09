import { useState } from 'react';
import { Player } from './player';
import { Tracks } from './tracks';
import { PlayList } from './playlist';
import { SongProvider } from './context/songContext';

import './common.scss';

function App() {
  const [selectedTracks, setSelectedTracks] = useState<Number>(2);
  const [showTracks, setShowTracks] = useState<boolean>(false);
  const [showSongsList, setShowSongsList] = useState<boolean>(false);

  const hideAllOverlap = () => {
    if (showSongsList) {
      setShowSongsList(false);
    }
    if (showTracks) {
      setShowTracks(false);
    }
  }

  return (
    <SongProvider>
      <div className="main">
        <div className={`item1 ${!showTracks ? 'hideEle' : ''}`}>
          <Tracks selected={selectedTracks} onChange={(id: Number) => setSelectedTracks(id)} />
        </div>
        <div className={`item2 ${!showSongsList ? 'hideEle' : ''}`}>
          <PlayList />
        </div>
        <div className="item3" onClick={hideAllOverlap}>
          <Player setShowTracks={() => setShowTracks(!showTracks)} setShowSongsList={() => setShowSongsList(!showSongsList)} />
        </div>
      </div>
    </SongProvider>
  );
}

export default App;
