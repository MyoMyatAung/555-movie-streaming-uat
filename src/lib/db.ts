import Dexie, { type EntityTable } from "dexie";

export interface Bookmark {
  id?: number;
  vod_id: string;
  created_at: Date;
}

export interface WatchList {
  id?: number;
  vod_id: string;
  ep_id?: string;
  play_head_in_sec: number;
  duration: number;
  updated_at: Date;
  created_at?: Date;
}

export interface RecentSearch {
  search: string;
  created_at: Date;
}

const db = new Dexie("555Movie") as Dexie & {
  bookmarks: EntityTable<Bookmark, "id">;
  watchList: EntityTable<WatchList, "id">;
  recentSearch: EntityTable<RecentSearch, "search">;
};

// Schema declaration
db.version(1).stores({
  bookmarks: "++id, vod_id, created_at",
  watchList: "++id, [vod_id+ep_id], vod_id, updated_at, created_at",
  recentSearch: "search, created_at",
});

export { db };
