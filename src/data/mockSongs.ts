import { Song, Playlist } from '../types';

export const INITIAL_SONGS: Song[] = [];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'pl_01',
    name: 'Telugu Romantic Rain Vibes',
    description: 'Heart-touching melody songs for rainy drives and quiet evenings',
    coverArt: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80',
    songIds: [],
    isOfflineSynced: true,
    createdAt: '2026-08-01'
  },
  {
    id: 'pl_02',
    name: 'Sid Sriram Pure Magic',
    description: 'The definitive soul-stirring collection sung by Sid Sriram',
    coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    songIds: [],
    isOfflineSynced: false,
    createdAt: '2026-08-10'
  },
  {
    id: 'pl_03',
    name: 'Anirudh Melodic Hits',
    description: 'Sublime acoustics and memorable hooks composed by Anirudh',
    coverArt: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    songIds: [],
    isOfflineSynced: true,
    createdAt: '2026-08-15'
  }
];
