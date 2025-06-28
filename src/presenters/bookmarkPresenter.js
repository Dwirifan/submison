import { DatabaseOperations } from '../scripts/data/story-db.js';

export default class BookmarkPresenter {
  #view;

  constructor({ view }) {
    this.#view = view;
  }

  async showBookmarkedStories() {
    try {
      const stories = await DatabaseOperations.getAllData();

      if (stories.length === 0) {
        this.#view.showEmptyMessage();
      } else {
        this.#view.showStories(stories);
      }
    } catch (error) {
      this.#view.showError(error.message);
    }
  }
}
