export interface Collection {
  id: string;
  title: string;
  imageUrl?: string;
  videoCount: number;
  isPublic: boolean;
  views?: string;
}

export interface CollectionItem {
  id: string;
  title: string;
  imageUrl: string;
  typeDesc: string;
  episodes: number;
  rating: number;
  resolution?: string;
}
