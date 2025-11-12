import { db } from "@/lib/db";

/**
 * Seeds the watchlist with sample data for development/testing
 * This simulates videos that users have started watching
 *
 * ⚠️ IMPORTANT: If Continue Watching doesn't show, clear IndexedDB first!
 *
 * Usage in Browser Console:
 * ```javascript
 * // Clear and re-seed (RECOMMENDED)
 * await db.watchList.clear()
 * window.location.reload()
 *
 * // View current watchlist
 * await db.watchList.toArray()
 *
 * // Count items
 * await db.watchList.count()
 *
 * // Add test data manually
 * await db.watchList.add({
 *   vod_id: "cw1",
 *   ep_id: "",
 *   play_head_in_sec: 1200,
 *   duration: 10140,
 *   updated_at: new Date()
 * })
 * ```
 */
export async function seedWatchlist(force: boolean = false) {
  try {
    // Check if watchlist already has data
    const count = await db.watchList.count();
    if (count > 0 && !force) {
      console.log(
        "Watchlist already has data, skipping seed. Use seedWatchlist(true) to force re-seed.",
      );
      return;
    }

    // Clear existing data if force is true
    if (force && count > 0) {
      await db.watchList.clear();
      console.log("🧹 Cleared existing watchlist data");
    }

    // Sample watch history data with proper date categorization
    // These IDs match the IDs in mockMovies.ts (using ID 1-6)
    const now = new Date();
    const sampleWatchlist = [
      // Today
      {
        vod_id: "1", // Fantastic 4
        ep_id: "",
        play_head_in_sec: 1200, // 20 minutes in
        duration: 9360, // 2hr 36mins = 156 * 60
        updated_at: new Date(now.getTime() - 1000 * 60 * 30), // 30 mins ago
        created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
      },
      {
        vod_id: "2", // Thunder Bolts
        ep_id: "",
        play_head_in_sec: 600, // 10 minutes in
        duration: 9360, // 2hr 36mins
        updated_at: new Date(now.getTime() - 1000 * 60 * 120), // 2 hours ago
        created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      },
      // Yesterday
      {
        vod_id: "3", // Agatha All Along
        ep_id: "S1.EP3",
        play_head_in_sec: 900, // 15 minutes in
        duration: 2700, // 45 mins episode
        updated_at: new Date(now.getTime() - 1000 * 60 * 60 * 24), // 1 day ago
        created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
      },
      // This Week
      {
        vod_id: "4", // Wakanda Forever
        ep_id: "",
        play_head_in_sec: 2400, // 40 minutes in
        duration: 9360, // 2hr 36mins
        updated_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
      },
      // Last Week
      {
        vod_id: "5", // Iron Heart
        ep_id: "S1.EP6",
        play_head_in_sec: 1800, // 30 minutes in
        duration: 3600, // 1 hour episode
        updated_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 9), // 9 days ago
        created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
      },
      // This Month
      {
        vod_id: "6", // Spider-Man Across
        ep_id: "",
        play_head_in_sec: 3000, // 50 minutes in
        duration: 9360, // 2hr 36mins
        updated_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 20), // 20 days ago
        created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 25), // 25 days ago
      },
    ];

    // Add all sample data to IndexedDB
    await db.watchList.bulkAdd(sampleWatchlist);

    console.log(
      `✅ Successfully seeded ${sampleWatchlist.length} items to watchlist`,
    );
  } catch (error) {
    console.error("Error seeding watchlist:", error);
  }
}

/**
 * Clears all watchlist data (useful for testing)
 */
export async function clearWatchlist() {
  try {
    await db.watchList.clear();
    console.log("✅ Watchlist cleared");
  } catch (error) {
    console.error("Error clearing watchlist:", error);
  }
}

/**
 * Add a single video to watchlist (for manual testing)
 */
export async function addToWatchlistForTesting(
  vodId: string,
  progress: number = 0.2,
  episodeId: string = "",
) {
  try {
    await db.watchList.add({
      vod_id: vodId,
      ep_id: episodeId,
      play_head_in_sec: Math.floor(9360 * progress), // Assuming 2hr 36min video
      duration: 9360,
      updated_at: new Date(),
    });
    console.log(
      `✅ Added video ${vodId} to watchlist with ${progress * 100}% progress`,
    );
  } catch (error) {
    console.error("Error adding to watchlist:", error);
  }
}
