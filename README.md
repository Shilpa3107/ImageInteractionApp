# PixelStream - Real-Time Image Interaction Platform

A high-performance, multi-user image gallery and interaction platform built for the **FotoOwl React Intern Assignment**. Features real-time synchronization of emojis and comments, a global activity feed, and a premium dark-mode UI.

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![React](https://img.shields.io/badge/React-19-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8)
![Database](https://img.shields.io/badge/InstantDB-Real--Time-orange)

## 🚀 Live Demo & Repository
- **Live App**: [Deployment Link Pending]
- **GitHub**: [Repository Link Pending]

---

## 🛠️ Tech Stack & Architecture

### **Core Technologies**
- **Framework**: React 19 (Functional Components)
- **Styling**: Tailwind CSS v4 (Modern CSS-first approach)
- **Real-Time DB**: [InstantDB](https://www.instantdb.com/) - Integrated for its seamless graph-based real-time sync.
- **State Management**: 
  - **Zustand**: Local UI state, persistent user identity.
  - **TanStack Query (React Query)**: Unsplash API fetching, caching, and infinite scroll logic.
- **Animations**: Framer Motion (Layout transitions, feed items).
- **Icons**: Lucide React.

---

## 📦 Setup Instructions

1.  **Clone the repository**:
    ```bash
    git clone <repo-url>
    cd <repo-folder>
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in the root directory:
    ```env
    VITE_UNSPLASH_ACCESS_KEY=your_key_here
    VITE_INSTANT_APP_ID=your_id_here
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

---

## 🔌 API Handling Strategy

### **Unsplash API**
Used for providing high-quality photography.
- **Strategy**: Implemented using `useInfiniteQuery` from TanStack Query.
- **Logic**: Fetches images in pages of 12. `react-intersection-observer` triggers the next page fetch as the user scrolls.
- **Fallback**: Built-in mock data fallback allows testing the UI even if the Unsplash API key is missing or rate-limited.

### **InstantDB Schema**
The database is structured into four primary namespaces:
1.  **`reactions`**: Tracks emojis linked to `imageId` and `userId`.
2.  **`comments`**: Stores user-generated text, timestamps, and user profile data.
3.  **`feedEvents`**: A flattened stream of interactions for the global activity feed.
4.  **`profiles`**: (Handled via Zustand locally for this task, but synced via payload in DB).

---

## 🧠 Key React Decisions

1.  **Global Modal Management**: Moved the `ImageModal` to the `Home` level, controlled by a global `selectedImageId` in Zustand. This allows the Feed and the Gallery to share the same interaction context.
2.  **Custom Interaction Hooks**: Abstracted `useReactions` and `useComments` to encapsulate InstantDB transaction logic, keeping components lean.
3.  **Component Decomposition**: Separated the **Feed** (Global context) from the **Gallery** (Image context) while ensuring they stay synchronized through the Shared DB layer.

---

## 🚧 Challenges & Solutions

### **Challenge 1: Tailwind v4 PostCSS Conflict**
- **Issue**: Standard Vite setups often conflict with the new `@tailwindcss/postcss` plugin in v4.
- **Solution**: Migrated the PostCSS config to use the explicit `@tailwindcss/postcss` package and moved theme tokens into the CSS file using the `@theme` block.

### **Challenge 2: Real-Time State Flickering**
- **Issue**: Optimistic updates in real-time apps can sometimes cause flickering if the DB push is slow.
- **Solution**: Leveraged InstantDB’s built-in optimistic UI and combined it with Framer Motion `AnimatePresence` to ensure entry/exit of feed items feels organic.

### **Challenge 3: Feed-to-Gallery Navigation**
- **Issue**: Selecting an image from the feed needed to open the modal and potentially scroll the gallery.
- **Solution**: Integrated a global state in Zustand (`selectedImageId`) that any component can trigger.

---

## 📈 Future Improvements (Given More Time)

1.  **Full Search**: Integrate Unsplash search to allow users to find specific themes.
2.  **User Authentication**: Replace random identity with Google/GitHub Auth (InstantDB Auth).
3.  **Optimistic Deletion**: Improve the deletion UX with immediate transition.
4.  **Direct Image Uploads**: Allow users to contribute to the gallery.

