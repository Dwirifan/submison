// scripts/data/story-db.js
import { openDB } from 'idb';

const DB_NAME = 'storyapp';
const DB_VERSION = 1;
const OBJECT_STORE = 'saved-stories';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    db.createObjectStore(OBJECT_STORE, { keyPath: 'id' });
  }
});

const StoryDatabase = {
  async putStory(story) {
    return (await dbPromise).put(OBJECT_STORE, story);
  },

  async deleteStory(id) {
    return (await dbPromise).delete(OBJECT_STORE, id);
  },

  async getStoryById(id) {
    return (await dbPromise).get(OBJECT_STORE, id);
  },

  async getAllStories() {
    return (await dbPromise).getAll(OBJECT_STORE); // ✅ Tambahan penting!
  },
  async countStories() {
  return (await dbPromise).count(OBJECT_STORE);
},
};


export default StoryDatabase;
