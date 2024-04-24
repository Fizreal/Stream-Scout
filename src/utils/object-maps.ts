export const genreNames: { [key: string]: string } = {
  '10402': 'Music',
  '10749': 'Romance',
  '10751': 'Family',
  '10752': 'War',
  '10763': 'News',
  '10764': 'Reality',
  '10767': 'Talk Show',
  '12': 'Adventure',
  '14': 'Fantasy',
  '16': 'Animation',
  '18': 'Drama',
  '27': 'Horror',
  '28': 'Action',
  '35': 'Comedy',
  '36': 'History',
  '37': 'Western',
  '53': 'Thriller',
  '80': 'Crime',
  '878': 'Science Fiction',
  '9648': 'Mystery',
  '99': 'Documentary'
}

export const genreCodes: { [key: string]: string } = {
  Music: '10402',
  Romance: '10749',
  Family: '10751',
  War: '10752',
  News: '10763',
  Reality: '10764',
  'Talk Show': '10767',
  Adventure: '12',
  Fantasy: '14',
  Animation: '16',
  Drama: '18',
  Horror: '27',
  Action: '28',
  Comedy: '35',
  History: '36',
  Western: '37',
  Thriller: '53',
  Crime: '80',
  'Science Fiction': '878',
  Mystery: '9648',
  Documentary: '99'
}

export const countryNames: { [key: string]: string } = {
  ae: 'United Emirates',
  ar: 'Argentina',
  at: 'Austria',
  au: 'Australia',
  az: 'Azerbaijan',
  be: 'Belgium',
  bg: 'Bulgaria',
  br: 'Brazil',
  ca: 'Canada',
  ch: 'Switzerland',
  cl: 'Chile',
  co: 'Colombia',
  cy: 'Cyprus',
  cz: 'Czech Republic',
  de: 'Germany',
  dk: 'Denmark',
  ec: 'Ecuador',
  ee: 'Estonia',
  es: 'Spain',
  fi: 'Finland',
  fr: 'France',
  gb: 'United Kingdom',
  gr: 'Greece',
  hk: 'Hong Kong',
  hr: 'Croatia',
  hu: 'Hungary',
  id: 'Indonesia',
  ie: 'Ireland',
  il: 'Israel',
  in: 'India',
  is: 'Iceland',
  it: 'Italy',
  jp: 'Japan',
  kr: 'South Korea',
  lt: 'Lithuania',
  md: 'Moldova',
  mk: 'North Macedonia',
  mx: 'Mexico',
  my: 'Malaysia',
  nl: 'Netherlands',
  no: 'Norway',
  nz: 'New Zealand',
  pa: 'Panama',
  pe: 'Peru',
  ph: 'Philippines',
  pl: 'Poland',
  pt: 'Portugal',
  ro: 'Romania',
  rs: 'Serbia',
  ru: 'Russia',
  se: 'Sweden',
  sg: 'Singapore',
  si: 'Slovenia',
  th: 'Thailand',
  tr: 'Turkey',
  ua: 'Ukraine',
  us: 'United States',
  vn: 'Vietnam',
  za: 'South Africa'
}

export const streamIcons: {
  [key: string]: {
    name: string
    id: string
    image: string
  }
} = {
  apple: {
    name: 'Apple TV',
    id: 'apple',
    image:
      'https://media.movieofthenight.com/services/apple/logo-light-theme.svg'
  },
  curiosity: {
    name: 'Curiosity Stream',
    id: 'curiosity',
    image:
      'https://media.movieofthenight.com/services/curiosity/logo-light-theme.svg'
  },
  mubi: {
    name: 'Mubi',
    id: 'mubi',
    image:
      'https://media.movieofthenight.com/services/mubi/logo-light-theme.svg'
  },
  netflix: {
    name: 'Netflix',
    id: 'netflix',
    image:
      'https://media.movieofthenight.com/services/netflix/logo-light-theme.svg'
  },
  prime: {
    name: 'Prime Video',
    id: 'prime',
    image:
      'https://media.movieofthenight.com/services/prime/logo-light-theme.svg'
  },
  zee5: {
    name: 'Zee5',
    id: 'zee5',
    image:
      'https://media.movieofthenight.com/services/zee5/logo-light-theme.svg'
  },
  disney: {
    name: 'Disney+',
    id: 'disney',
    image:
      'https://media.movieofthenight.com/services/disney/logo-light-theme.svg'
  },
  hbo: {
    name: 'Max',
    id: 'hbo',
    image: 'https://media.movieofthenight.com/services/max/logo-light-theme.svg'
  },
  paramount: {
    name: 'Paramount+',
    id: 'paramount',
    image:
      'https://media.movieofthenight.com/services/paramount/logo-light-theme.svg'
  },
  britbox: {
    name: 'BritBox',
    id: 'britbox',
    image:
      'https://media.movieofthenight.com/services/britbox/logo-light-theme.svg'
  },
  stan: {
    name: 'Stan',
    id: 'stan',
    image:
      'https://media.movieofthenight.com/services/stan/logo-light-theme.svg'
  },
  crave: {
    name: 'Crave',
    id: 'crave',
    image:
      'https://media.movieofthenight.com/services/crave/logo-light-theme.svg'
  },
  hotstar: {
    name: 'Disney+ Hotstar',
    id: 'hotstar',
    image:
      'https://media.movieofthenight.com/services/disneyhotstar/logo-light-theme.svg'
  },
  wow: {
    name: 'Wow',
    id: 'wow',
    image: 'https://media.movieofthenight.com/services/wow/logo-light-theme.svg'
  },
  all4: {
    name: 'Channel 4',
    id: 'all4',
    image:
      'https://media.movieofthenight.com/services/all4/logo-light-theme.svg'
  },
  iplayer: {
    name: 'BBC iPlayer',
    id: 'iplayer',
    image:
      'https://media.movieofthenight.com/services/iplayer/logo-light-theme.svg'
  },
  now: {
    name: 'Now',
    id: 'now',
    image: 'https://media.movieofthenight.com/services/now/logo-light-theme.svg'
  },
  hulu: {
    name: 'Hulu',
    id: 'hulu',
    image:
      'https://media.movieofthenight.com/services/hulu/logo-light-theme.svg'
  },
  peacock: {
    name: 'Peacock',
    id: 'peacock',
    image:
      'https://media.movieofthenight.com/services/peacock/logo-light-theme.svg'
  },
  starz: {
    name: 'Starz',
    id: 'starz',
    image:
      'https://media.movieofthenight.com/services/starz/logo-light-theme.svg'
  }
}
