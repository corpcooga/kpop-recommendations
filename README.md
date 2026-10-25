# K-Pop Discovery Hub

An interactive web application designed to explore curated K-pop tracks and playlists with instant audio previews.

🔗 **[Live Demo](https://corpcooga.github.io/kpop-recommendations/)**

---

## Preview

| Desktop View | Mobile View |
| :---: | :---: |
| <img width="100%" src="https://github.com/user-attachments/assets/4465d1d5-c749-443e-89c5-aabc7cc58dc3" /> | <img width="100%" src="https://github.com/user-attachments/assets/24f0a867-978d-46e2-b573-787eb072deb9" /> |
| <img width="100%" src="https://github.com/user-attachments/assets/2d7bcc83-28e5-41ce-8b94-04329ccffcc8" /> | <img width="100%" src="https://github.com/user-attachments/assets/f0cdfdb4-fb9f-46f2-bcc5-0ba9b9b74242" /> |
| <img width="100%" src="https://github.com/user-attachments/assets/bd6d372d-b8d9-4b6a-8936-ac6111b1f079" /> | <img width="100%" src="https://github.com/user-attachments/assets/4bd6c27d-b371-4725-aa54-90decccec8cc" /> |

---

## Technical Highlights

- **Custom Audio Engine:** Eliminates playback latency using hover/touch pre-buffering, in-memory `Map` caching, and bandwidth-saving stream cancellation on rapid skips.
- **Responsive UI & Navigation:** Multi-column layout across 3 viewport breakpoints via CSS Grid and Flexbox, featuring a scroll-aware collapsible mobile navbar with delta thresholds and animation transition locks.
- **Automated Card Generator:** Internal utility querying the iTunes Search API to dynamically extract track metadata, 600px cover art, and audio streams into reusable HTML card templates.

---

## Built With

- **Frontend:** HTML5, CSS3 (Grid & Flexbox), Vanilla JavaScript (ES6+)
- **Media & Data:** Apple Music / iTunes Search API

---

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/corpcooga/kpop-recommendations.git
