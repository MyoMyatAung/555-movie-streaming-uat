import { db } from "@/lib/db";

export interface IWatchlistService {
  addToWatchlist(videoId: string, episodeId?: string): Promise<void>;
  updatePlayhead(
    videoId: string,
    episodeId: string | undefined,
    playhead: number,
    duration: number,
  ): Promise<void>;
  getPlayhead(videoId: string, episodeId?: string): Promise<number>;
  getOrCreateWatchlistEntry(
    videoId: string,
    episodeId?: string,
  ): Promise<{
    playhead: number;
    isNew: boolean;
  }>;
  removeFromWatchlist(videoId: string, episodeId?: string): Promise<void>;
  removeMultipleFromWatchlist(
    items: Array<{ videoId: string; episodeId?: string }>,
  ): Promise<void>;
}

export class WatchlistService implements IWatchlistService {
  async addToWatchlist(videoId: string, episodeId?: string): Promise<void> {
    try {
      const now = new Date();
      const newEntry = {
        vod_id: videoId,
        ep_id: episodeId || "",
        play_head_in_sec: 0,
        updated_at: now,
        created_at: now,
        duration: 0,
      };

      await db.watchList.add(newEntry);
      console.log("Successfully added to watchlist");
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      throw new Error("Failed to add to watchlist");
    }
  }

  async updatePlayhead(
    videoId: string,
    episodeId: string | undefined,
    playhead: number,
    duration: number,
  ): Promise<void> {
    try {
      const existingEntry = await db.watchList
        .where("vod_id")
        .equals(videoId)
        .filter((item) => item.ep_id === (episodeId || ""))
        .first();

      if (existingEntry) {
        await db.watchList.update(existingEntry.id!, {
          play_head_in_sec: playhead,
          duration: duration,
          updated_at: new Date(),
        });
      } else {
        // Create new entry if it doesn't exist
        const now = new Date();
        await db.watchList.add({
          vod_id: videoId,
          ep_id: episodeId || "",
          play_head_in_sec: playhead,
          duration: duration,
          updated_at: now,
          created_at: now,
        });
      }
    } catch (error) {
      console.error("Error updating playhead:", error);
      throw new Error("Failed to update playhead");
    }
  }

  async getPlayhead(videoId: string, episodeId?: string): Promise<number> {
    try {
      const existingEntry = await db.watchList
        .where("vod_id")
        .equals(videoId)
        .filter((item) => item.ep_id === (episodeId || ""))
        .first();

      return existingEntry?.play_head_in_sec ?? 0;
    } catch (error) {
      console.error("Error getting playhead:", error);
      return 0;
    }
  }

  async getOrCreateWatchlistEntry(
    videoId: string,
    episodeId?: string,
  ): Promise<{
    playhead: number;
    isNew: boolean;
  }> {
    try {
      const existingEntry = await db.watchList
        .where("vod_id")
        .equals(videoId)
        .filter((item) => item.ep_id === (episodeId || ""))
        .first();

      if (!existingEntry) {
        await this.addToWatchlist(videoId, episodeId);
        return { playhead: 0, isNew: true };
      }

      return { playhead: existingEntry.play_head_in_sec, isNew: false };
    } catch (error) {
      console.error("Error handling watchlist entry:", error);
      return { playhead: 0, isNew: false };
    }
  }

  async removeFromWatchlist(
    videoId: string,
    episodeId?: string,
  ): Promise<void> {
    try {
      await db.watchList
        .where("vod_id")
        .equals(videoId)
        .filter((item) => item.ep_id === (episodeId || ""))
        .delete();

      console.log("Successfully removed from watchlist");
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      throw new Error("Failed to remove from watchlist");
    }
  }

  async removeMultipleFromWatchlist(
    items: Array<{ videoId: string; episodeId?: string }>,
  ): Promise<void> {
    try {
      for (const item of items) {
        await this.removeFromWatchlist(item.videoId, item.episodeId);
      }
      console.log("Successfully removed multiple items from watchlist");
    } catch (error) {
      console.error("Error removing multiple items from watchlist:", error);
      throw new Error("Failed to remove multiple items from watchlist");
    }
  }
}

export const watchlistService = new WatchlistService();
