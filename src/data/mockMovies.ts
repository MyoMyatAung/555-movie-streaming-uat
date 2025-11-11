import type {
  ContentItem,
  ContentSection,
  HeroBannerItem,
} from "@/types/movie";

// Mock data - Replace with API calls later
export const mockHeroBanners: HeroBannerItem[] = [
  {
    id: "1",
    title: "1917",
    imageUrl:
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&h=400&fit=crop",
    genres: ["War", "Action"],
    duration: "2hr 48mins",
    description: "Two young British soldiers during the First World War",
  },
  {
    id: "2",
    title: "Dune",
    imageUrl:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=400&fit=crop",
    genres: ["Sci-Fi", "Adventure"],
    duration: "2hr 35mins",
    description: "A noble family becomes embroiled in a war for control",
  },
  {
    id: "3",
    title: "Interstellar",
    imageUrl:
      "https://images.unsplash.com/photo-1762652847337-d0bb9764308b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=900",
    genres: ["Sci-Fi", "Drama"],
    duration: "2hr 49mins",
    description: "A team of explorers travel through a wormhole in space",
  },
];

export const mockContinueWatching: ContentItem[] = [
  {
    id: "cw1",
    title: "Interstellar (2014)",
    imageUrl:
      "https://images.unsplash.com/photo-1761839258575-038fef381ee7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNXx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=700",
    type: "movie",
    duration: "2h 49min",
    badge: { type: "exclusive" },
    progress: 45,
    genres: ["Sci-Fi", "Drama"],
    description:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
  },
  {
    id: "cw2",
    title: "Mandalorian",
    imageUrl:
      "https://images.unsplash.com/photo-1762709753434-abea23356eed?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMXx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=700",
    type: "tv_series",
    badge: { type: "exclusive" },
    episodeInfo: "S2.EP3",
    episodes: 16,
    duration: "45min",
    genres: ["Sci-Fi", "Adventure"],
    description:
      "The American television series The Mandalorian is part of the Star Wars franchise, set after the events of the film Return of the Jedi.",
  },
];

export const mockLatestMovies: ContentItem[] = [
  {
    id: "lm1",
    title: "Coringa",
    imageUrl:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop",
    type: "movie",
    duration: "2h 49min",
    rating: 7.1,
    genres: ["Thriller", "Drama"],
    description:
      "A failed comedian begins a slow descent into madness as he transforms into a criminal mastermind.",
  },
  {
    id: "lm3",
    title: "The Nun",
    imageUrl:
      "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=450&fit=crop",
    type: "movie",
    duration: "2h 49min",
    badge: { type: "highly_recommended" },
    genres: ["Horror", "Mystery"],
    description:
      "A priest and a novice investigate the death of a nun in Romania and confront a malevolent force in the form of a demonic nun.",
  },
  {
    id: "lm4",
    title: "Inception",
    imageUrl:
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&h=450&fit=crop",
    type: "movie",
    duration: "2h 28min",
    rating: 8.8,
    genres: ["Sci-Fi", "Action"],
    description:
      "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
  },
];

export const mockTopTenWatchlist: ContentItem[] = [
  {
    id: "tt1",
    title: "King The Land",
    imageUrl:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop",
    type: "tv_series",
    episodes: 48,
    badge: { type: "top_rank", rank: 1 },
    duration: "1h 10min",
    genres: ["Romance", "Comedy"],
    description:
      "A story about a chaebol heir who falls in love with a hotelier employee with a bright smile.",
  },
  {
    id: "tt3",
    title: "Moon Lover",
    imageUrl:
      "https://images.unsplash.com/photo-1761872936220-1531e97a158a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMzZ8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&q=60&w=900",
    type: "tv_series",
    episodes: 48,
    badge: { type: "top_rank", rank: 3 },
    duration: "1h 5min",
    genres: ["Historical", "Romance"],
    description:
      "A woman travels back in time to the Goryeo Dynasty and becomes entangled with the royal princes.",
  },
  {
    id: "tt4",
    title: "Mandalorian",
    imageUrl:
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&h=450&fit=crop",
    type: "tv_series",
    episodes: 24,
    badge: { type: "top_rank", rank: 4 },
    duration: "45min",
    genres: ["Sci-Fi", "Adventure"],
    description:
      "The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.",
  },
];

export const mockTrendingNow: ContentItem[] = [
  {
    id: "tn1",
    title: "Go Ahead",
    imageUrl:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop",
    type: "tv_series",
    duration: "45min",
    genres: ["Drama", "Family"],
    description:
      "Three individuals form an unconventional family as they grow up together and face the challenges of life.",
  },
  {
    id: "tn3",
    title: "Stranger Things",
    imageUrl:
      "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=450&fit=crop",
    type: "tv_series",
    badge: { type: "best_of_month" },
    duration: "55min",
    genres: ["Sci-Fi", "Horror"],
    description:
      "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.",
  },
  {
    id: "tn4",
    title: "Breaking Bad",
    imageUrl:
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&h=450&fit=crop",
    type: "tv_series",
    rating: 9.5,
    duration: "47min",
    genres: ["Crime", "Drama"],
    description:
      "A high school chemistry teacher turned meth producer partners with a former student to secure his family's future.",
  },
];

export const mockContentSections: ContentSection[] = [
  {
    id: "continue-watching",
    title: "Continue Watching",
    items: mockContinueWatching,
    showSeeAll: true,
  },
  {
    id: "latest-movies",
    title: "Latest Movies",
    items: mockLatestMovies,
    showSeeAll: true,
  },
  {
    id: "top-ten",
    title: "Top Ten Watchlist",
    items: mockTopTenWatchlist,
    showSeeAll: true,
  },
  {
    id: "trending",
    title: "Trending Now",
    items: mockTrendingNow,
    showSeeAll: true,
  },
];
