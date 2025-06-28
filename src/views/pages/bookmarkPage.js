import StoryDatabase from "../../scripts/data/story-db";
import Swal from "sweetalert2";
import Navbar from "../component/navbar"; // pastikan path-nya sesuai

class bookmarkPage {
  async render() {
    return `
      <section class="bookmark container">
        <h1>📌 Cerita Yang Tersimpan</h1>
        <div id="bookmark-list" class="story-list loading">Memuat daftar cerita...</div>
      </section>
    `;
  }

  async afterRender() {
    await this.#loadBookmarks();
  }

  async #loadBookmarks() {
    const container = document.getElementById("bookmark-list");
    try {
      const stories = await StoryDatabase.getAllStories();

      if (!stories.length) {
        container.innerHTML = `<p>Tidak ada cerita yang tersimpan.</p>`;
        return;
      }

      container.classList.remove("loading");
      container.innerHTML = stories.map((story) => this.#generateCardHTML(story)).join("");

      this.#attachDeleteHandlers();
    } catch (error) {
      container.innerHTML = `<p class="error">Gagal memuat bookmark: ${error.message}</p>`;
    }
  }

  #generateCardHTML(story) {
    return `
      <div class="story-card" data-id="${story.id}">
        <img src="${story.photoUrl}" alt="Foto ${story.name}" class="story-thumbnail" />
        <div class="story-info">
          <h2>${story.name}</h2>
          <p>${story.description.slice(0, 80)}...</p>
          <div class="button-container">
            <a href="#/stories/${story.id}" class="btn btn-primary">Lihat Detail</a>
            <button class="btn btn-danger remove-bookmark" data-id="${story.id}">
              Hapus
            </button>
          </div>
        </div>
      </div>
    `;
  }

  #attachDeleteHandlers() {
    const buttons = document.querySelectorAll(".remove-bookmark");
    buttons.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.currentTarget.getAttribute("data-id");

        const confirm = await Swal.fire({
          title: "Yakin ingin menghapus?",
          text: "Cerita ini akan dihapus dari bookmark.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Ya, hapus!",
          cancelButtonText: "Batal",
        });

        if (confirm.isConfirmed) {
          try {
            await StoryDatabase.deleteStory(id);
            await Navbar.updateBookmarkBadge(); 
            await this.#loadBookmarks(); 
            Swal.fire("Dihapus!", "Cerita berhasil dihapus.", "success");
          } catch (err) {
            Swal.fire("Gagal", err.message, "error");
          }
        }
      });
    });
  }
}

export default bookmarkPage;