# Kanban Web App

A powerful, high-fidelity clone of a Kanban Board functionality efficiently managing tasks with a modern UI and smooth user experience.

![Kanban Board Screenshot](/placeholder-screenshot.png)

## Features

### Core Functionality
*   **Kanban Board**: Visualize your workflow with customizable columns.
*   **Drag & Drop**: Smooth drag-and-drop support for tasks and columns using `@hello-pangea/dnd`.
*   **Task Management**: Create, edit, and delete tasks with ease.
*   **Column Management**: Add, rename, color-code, and delete columns.
*   **Persistence**: All data is automatically saved to local storage.

### Advanced Features
*   **Theming**: Fully toggleable **Dark/Light Mode** with persistent preference.
*   **Search**: Real-time **Task Search** to quickly filter your board.
*   **Customization**: Color-code both tasks and column headers for better organization.
*   **Notifications**: Interactive **Toast Notifications** for all major actions.
*   **Safety**: "Clear Board" functionality with explicit confirmation to prevent accidental data loss.

### Technical Highlights
*   **State Management**: Powered by **Zustand** for performant and simple state logic.
*   **UI Library**: Built with **Material UI (MUI)** for a polished, responsive design.
*   **Architecture**: Clean, component-based React architecture with separated concerns.
*   **Type Safety**: 100% **TypeScript** for robust reliability.

## Getting Started

### Prerequisites
*   Node.js (v18+)
*   npm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/kanban-web-app.git
    cd kanban-web-app
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## Project Structure
```
src/
├── components/         # Reusable UI components
│   ├── board/          # Board-specific components (Board, Column, TaskCard)
│   ├── layout/         # Layout components (AppLayout)
│   └── modals/         # Modal dialogs (Task, Column, Confirm)
├── context/            # React Contexts (Theme, Notification)
├── hooks/              # Custom Hooks (useStore)
├── screens/            # Page-level components
├── theme.tsx           # MUI Theme configuration
└── App.tsx             # Main Application entry point
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements.

## License

This project is open-source and available under the [MIT License](LICENSE).
