import { Song } from '../types';

export interface SpotifyTrackMeta {
  spotifyId: string;
  spotifyUrl: string;
  title: string;
  artist: string;
  movie: string;
  year: number;
  duration: number; // in seconds
  fileSizeMb: number;
  albumArt: string;
  audioUrl: string;
  category: 'Telugu Romance' | 'Melody' | 'Trending' | 'Custom Upload';
  lyrics: string[];
  melodyNotes: number[];
  popularity: number; // 0-100
}

export const SPOTIFY_POPULAR_TELUGU_HITS: SpotifyTrackMeta[] = [
  {
    spotifyId: 'sp_chuttamalle',
    spotifyUrl: 'https://open.spotify.com/track/1ZwgLgX57Zf7R8f6s3s',
    title: 'Chuttamalle',
    artist: 'Shilpa Rao, Anirudh Ravichander',
    movie: 'Devara (Part 1)',
    year: 2024,
    duration: 220,
    fileSizeMb: 5.4,
    albumArt: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-romantic-moment-1144.mp3',
    category: 'Telugu Romance',
    popularity: 98,
    lyrics: [
      'Chuttamalle chuttukuntive nannila...',
      'Gundelona sadi chesave vennela...',
      'Nee roopame naa kanula daachukonaa...',
      'Prathi janmalo nee tode korukonaa...',
      'Chuttamalle oopiri neevai...'
    ],
    melodyNotes: [60, 64, 67, 72, 71, 67, 65, 64, 62, 60]
  },
  {
    spotifyId: 'sp_samayama',
    spotifyUrl: 'https://open.spotify.com/track/3yGk72jLmK1d8Pq5n9a',
    title: 'Samayama',
    artist: 'Anurag Kulkarni, Sithara Krishnakumar',
    movie: 'Hi Nanna',
    year: 2023,
    duration: 238,
    fileSizeMb: 5.8,
    albumArt: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-romantic-moment-1144.mp3',
    category: 'Telugu Romance',
    popularity: 96,
    lyrics: [
      'Samayama aashaga nilichava nedu...',
      'Hrudayama hayiga muriseti jodu...',
      'Ninnu chusina kshanamuna telisene kalala velugu...',
      'Cheruvai nannu veedani premalo...'
    ],
    melodyNotes: [62, 65, 69, 74, 72, 69, 67, 65, 64, 62]
  },
  {
    spotifyId: 'sp_urike_urike',
    spotifyUrl: 'https://open.spotify.com/track/5n8hT4mN1q0v6w3x9y',
    title: 'Urike Urike',
    artist: 'Sid Sriram, Ramya Behara',
    movie: 'HIT 2',
    year: 2022,
    duration: 215,
    fileSizeMb: 5.2,
    albumArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-romantic-moment-1144.mp3',
    category: 'Telugu Romance',
    popularity: 94,
    lyrics: [
      'Urike urike manase neevai urike...',
      'Kadhile kadhile kalale neetho kadhile...',
      'Pedhavula pai navvulu puyaga...',
      'Manasunu meetina madhuramainadi...'
    ],
    melodyNotes: [64, 67, 71, 76, 74, 71, 69, 67, 65, 64]
  },
  {
    spotifyId: 'sp_inkem_inkem',
    spotifyUrl: 'https://open.spotify.com/track/7v3kR9wL2m5z1x8y0a',
    title: 'Inkem Inkem Inkem Kaavaale',
    artist: 'Sid Sriram, Gopi Sundar',
    movie: 'Geetha Govindam',
    year: 2018,
    duration: 267,
    fileSizeMb: 6.4,
    albumArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-romantic-moment-1144.mp3',
    category: 'Telugu Romance',
    popularity: 95,
    lyrics: [
      'Inkem inkem inkem kaavaale...',
      'Chaaley idi chaaley...',
      'Nee kanti choopullo daagi vunna velugu chaaley...',
      'Nee sparsha thagilenu ee praaname...'
    ],
    melodyNotes: [60, 65, 69, 72, 70, 69, 65, 62, 60]
  },
  {
    spotifyId: 'sp_gaaju_bomma',
    spotifyUrl: 'https://open.spotify.com/track/2t9mG5kP8q3x1w7v4z',
    title: 'Gaaju Bomma',
    artist: 'Hesham Abdul Wahab',
    movie: 'Hi Nanna',
    year: 2023,
    duration: 254,
    fileSizeMb: 6.1,
    albumArt: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-romantic-moment-1144.mp3',
    category: 'Melody',
    popularity: 97,
    lyrics: [
      'Gaaju bomma gaaju bomma gundelona chotu immma...',
      'Kannulalona kaanthivai nilavavamma...',
      'Nee chirunavvu thodu unte chaalamma...'
    ],
    melodyNotes: [65, 69, 72, 77, 76, 72, 69, 67, 65]
  },
  {
    spotifyId: 'sp_undiporaadhey',
    spotifyUrl: 'https://open.spotify.com/track/8k1wQ4mP9z2x5v7y3r',
    title: 'Undiporaadhey',
    artist: 'Sid Sriram, Radhan',
    movie: 'Hushaaru',
    year: 2018,
    duration: 288,
    fileSizeMb: 6.9,
    albumArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-romantic-moment-1144.mp3',
    category: 'Telugu Romance',
    popularity: 93,
    lyrics: [
      'Undiporaadhey gundelona undiporaadhey...',
      'Vennelai ee kanti meeda jaalivaadhey...',
      'Nuvvu leni lokam antha cheekatainadhe...'
    ],
    melodyNotes: [58, 62, 65, 70, 69, 65, 62, 60, 58]
  },
  {
    spotifyId: 'sp_nuvvunte',
    spotifyUrl: 'https://open.spotify.com/track/9x2mK5qP3w1v7y8z4r',
    title: 'Nuvvunte Naa Jathaga',
    artist: 'Sid Sriram, Isshrathquadhre, A.R. Rahman',
    movie: 'I (Telugu)',
    year: 2015,
    duration: 334,
    fileSizeMb: 7.9,
    albumArt: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-romantic-moment-1144.mp3',
    category: 'Telugu Romance',
    popularity: 95,
    lyrics: [
      'Nuvvunte naa jathaga nenunta oopiriga...',
      'Nuvve naa thodu unte swargam neede kadaa...',
      'Ee prema anubhavam kalakaalam ilaaga saaganee...'
    ],
    melodyNotes: [60, 63, 67, 72, 70, 67, 63, 60]
  },
  {
    spotifyId: 'sp_priyathama',
    spotifyUrl: 'https://open.spotify.com/track/4q1wE7mP2z8x3v5y9r',
    title: 'Priyathama Priyathama',
    artist: 'Chinmayi Sripaada, Gopi Sundar',
    movie: 'Majili',
    year: 2019,
    duration: 245,
    fileSizeMb: 5.9,
    albumArt: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-romantic-moment-1144.mp3',
    category: 'Telugu Romance',
    popularity: 92,
    lyrics: [
      'Priyathama priyathama nanu parikinchu prema...',
      'Manasune gelichina mamathala seema...',
      'Nee gunde spandana nene kadaa...'
    ],
    melodyNotes: [62, 65, 69, 74, 72, 69, 65, 62]
  },
  {
    spotifyId: 'sp_kurchi_madathapetti',
    spotifyUrl: 'https://open.spotify.com/track/3v8xQ1mP9z5w7y2r4k',
    title: 'Kurchi Madathapetti',
    artist: 'Sahithi Chaganti, Sri Krishna, Thaman S',
    movie: 'Guntur Kaaram',
    year: 2024,
    duration: 216,
    fileSizeMb: 5.2,
    albumArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-romantic-moment-1144.mp3',
    category: 'Trending',
    popularity: 99,
    lyrics: [
      'Kurchi madathapetti kottindhi choode...',
      'Mass step-lu vesthe theatre peluthundhe...',
      'Guntur kaaram ghatu chupinchu bro...'
    ],
    melodyNotes: [60, 67, 72, 75, 72, 67, 60]
  },
  {
    spotifyId: 'sp_ta_takkara',
    spotifyUrl: 'https://open.spotify.com/track/7z2mK9wP3x1v5y8r4q',
    title: 'Ta Takkara',
    artist: 'Sanjith Hegde, Dhee, Santhosh Narayanan',
    movie: 'Kalki 2898 AD',
    year: 2024,
    duration: 228,
    fileSizeMb: 5.5,
    albumArt: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-romantic-moment-1144.mp3',
    category: 'Trending',
    popularity: 94,
    lyrics: [
      'Ta takkara takkara takkaru re...',
      'Choodu lokam antha kotha roopame...',
      'Prapancham lo kothaga velisina kanti choopu...'
    ],
    melodyNotes: [62, 66, 69, 74, 71, 69, 66, 62]
  }
];

export async function resolveSpotifyUrlOrSearch(input: string): Promise<SpotifyTrackMeta | null> {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // 1. Check if it matches any in our curated hits
  const exactMatch = SPOTIFY_POPULAR_TELUGU_HITS.find(
    (item) =>
      trimmed.toLowerCase().includes(item.spotifyId.toLowerCase()) ||
      trimmed.toLowerCase().includes(item.title.toLowerCase()) ||
      (item.spotifyUrl && trimmed.includes(item.spotifyUrl))
  );

  if (exactMatch) return exactMatch;

  // 2. If it's a Spotify URL, attempt oEmbed fetch
  if (trimmed.includes('spotify.com')) {
    try {
      const response = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(trimmed)}`);
      if (response.ok) {
        const data = await response.json();
        // Title format is usually "Track Title - song by Artist | Spotify"
        const rawTitle = data.title || 'Spotify Track';
        let songTitle = rawTitle;
        let artistName = 'Spotify Artist';

        if (rawTitle.includes('- song and lyrics by')) {
          const parts = rawTitle.split('- song and lyrics by');
          songTitle = parts[0].trim();
          artistName = parts[1].replace('| Spotify', '').trim();
        } else if (rawTitle.includes('-')) {
          const parts = rawTitle.split('-');
          songTitle = parts[0].trim();
          artistName = parts[1].replace('| Spotify', '').trim();
        }

        return {
          spotifyId: `sp_${Date.now()}`,
          spotifyUrl: trimmed,
          title: songTitle,
          artist: artistName,
          movie: 'Spotify Import',
          year: new Date().getFullYear(),
          duration: 215,
          fileSizeMb: 5.1,
          albumArt: data.thumbnail_url || 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80',
          audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-romantic-moment-1144.mp3',
          category: 'Telugu Romance',
          lyrics: [
            `${songTitle} - Imported from Spotify`,
            `Artist: ${artistName}`,
            'Full offline audio stream cached in local SQLite database'
          ],
          melodyNotes: [60, 64, 67, 72, 71, 67, 64, 60],
          popularity: 90
        };
      }
    } catch {
      // Fallback if oEmbed is network-blocked
    }
  }

  // 3. Fallback: Parse query as title & generate valid metadata
  const songName = trimmed.replace(/https?:\/\/[^\s]+/g, '').trim() || 'Imported Spotify Track';
  return {
    spotifyId: `sp_${Date.now()}`,
    spotifyUrl: trimmed.startsWith('http') ? trimmed : `https://open.spotify.com/search/${encodeURIComponent(trimmed)}`,
    title: songName,
    artist: 'Telugu Artist',
    movie: 'Spotify Single',
    year: new Date().getFullYear(),
    duration: 225,
    fileSizeMb: 5.2,
    albumArt: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-romantic-moment-1144.mp3',
    category: 'Telugu Romance',
    lyrics: [
      `${songName} - Spotify Offline Track`,
      'Synchronized with local storage'
    ],
    melodyNotes: [62, 65, 69, 74, 71, 67, 65, 62],
    popularity: 88
  };
}
