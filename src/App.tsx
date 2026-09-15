import React, { useState } from 'react';
import { MusicProvider } from './context/MusicContext';
import { AppLayout } from './components/AppLayout';
import { LibraryView } from './components/LibraryView';
import { PlaylistsView } from './components/PlaylistsView';
import { StorageSettingsView } from './components/StorageSettingsView';
import { MiniPlayer } from './components/MiniPlayer';
import { PlayerView } from './components/PlayerView';
import { EqualizerModal } from './components/EqualizerModal';
import { UploadModal } from './components/UploadModal';
import { TabType } from './types';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('library');

  return (
    <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {/* Active Content View Outlet */}
      <div className="w-full">
        {activeTab === 'library' && <LibraryView />}
        {activeTab === 'playlists' && <PlaylistsView />}
        {activeTab === 'favorites' && <LibraryView />}
        {activeTab === 'storage' && <StorageSettingsView />}
      </div>

      {/* Persistent Mini Player (Mobile) */}
      <MiniPlayer />

      {/* Core Audio Modals */}
      <PlayerView />
      <EqualizerModal />
      <UploadModal />
    </AppLayout>
  );
};

export default function App() {
  return (
    <MusicProvider>
      <MainAppContent />
    </MusicProvider>
  );
}
