export interface Comment {
  id: number;
  author: string;
  text: string;
  timestamp: string;
  avatar: string;
  isLiked: boolean;
  likesCount: number;
  replies?: Comment[];
}

export const mockComments: Comment[] = [
  {
    id: 1,
    author: "MovieFan123",
    text: "This movie was amazing! The plot twists kept me on the edge of my seat.",
    timestamp: "2023-10-01T10:00:00Z",
    avatar: "https://avatars.steamstatic.com/fa756ff3c17205f0da5dfbf47ec8ed160b877015_full.jpg",
    isLiked: true,
    likesCount: 42,
    replies: [
      {
        id: 2,
        author: "CinemaBuff",
        text: "Totally agree! The ending was unexpected.",
        timestamp: "2023-10-01T10:15:00Z",
        avatar: "https://avatars.steamstatic.com/fa763e8fec8d8cdc89d2927995fef7b00ad454c7_full.jpg",
        isLiked: false,
        likesCount: 15,
      },
      {
        id: 3,
        author: "CriticJoe",
        text: "I thought it was overhyped. The acting was subpar.",
        timestamp: "2023-10-01T10:30:00Z",
        avatar: "https://avatars.steamstatic.com/fab53f21fbd9cd4a23dac0534d0690828f028c0a_full.jpg",
        isLiked: true,
        likesCount: 8,
      },
      {
        id: 4,
        author: "MovieFan123",
        text: "Respectfully disagree. The leads were fantastic.",
        timestamp: "2023-10-01T10:45:00Z",
        avatar: "https://avatars.steamstatic.com/fabb61c302a76b96edcfa6ad5dc0c2e20ba4a2a1_full.jpg",
        isLiked: false,
        likesCount: 22,
      },
    ],
  },
  {
    id: 5,
    author: "FilmLover",
    text: "Great visuals, but the soundtrack could have been better.",
    timestamp: "2023-10-01T11:00:00Z",
    avatar: "https://avatars.steamstatic.com/fabea5952a02bd00cb6212937e6905311633e820_full.jpg",
    isLiked: true,
    likesCount: 30,
  },
  {
    id: 6,
    author: "ReviewerX",
    text: "One of the best films this year. Highly recommend!",
    timestamp: "2023-10-01T11:30:00Z",
    avatar: "https://avatars.steamstatic.com/fad0a8c8f2900d992367accf96a1db00d459623d_full.jpg",
    isLiked: false,
    likesCount: 55,
    replies: [
      {
        id: 7,
        author: "SkepticUser",
        text: "I found it boring. Too slow-paced.",
        timestamp: "2023-10-01T11:45:00Z",
        avatar: "https://avatars.steamstatic.com/fab3b6423d91dc5ac3f301fa52bd6614d8444ced_full.jpg",
        isLiked: true,
        likesCount: 12,
      },
    ],
  },
];
