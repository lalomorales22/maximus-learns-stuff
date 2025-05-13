# Maximus Learns Stuff

This is a NextJS starter in Firebase Studio, an educational game application for children aged 6-9, focused on Math, Reading, Typing, Drawing, Coding, and Social Skills.

To get started, take a look at `src/app/page.tsx`.

## Repository

You can find the source code for this project on GitHub:
[lalomorales22/maximus-learns-stuff](https://github.com/lalomorales22/maximus-learns-stuff)

## Project Goal

Create a fun, colorful, and interactive application to help young children practice basic math, reading comprehension, typing skills, creativity, coding logic, and pro-social behaviors. The application is built with Next.js and aims to provide an engaging learning experience, themed around a "Fortnite" like environment where users earn "V-Bucks" for completing educational missions.

## Core Features

*   **Main Landing Page**: Displays various learning modules as "Missions".
*   **Math Mission**: Solve arithmetic problems with adaptive difficulty.
*   **Reading Quest**: Read short passages and answer comprehension questions (implicitly measured by time).
*   **Typing Drill**: Practice typing with dynamically generated text and performance feedback.
*   **Creative Mode (Draw)**: A digital canvas for free-form drawing with color and brush size selection.
*   **Coding Combat**: A drag-and-drop style interface to build simple programs and see a character move.
*   **Kindness Arena**: Scenarios where users choose the "kindest" option to learn social skills.
*   **Scoring System**: Users earn "V-Bucks" (in-game currency) and progress through "Tiers" (levels).

## Technology Stack

*   **Frontend**: Next.js (with React and TypeScript)
*   **Styling**: Tailwind CSS with ShadCN UI components
*   **AI/Generative Features**: Genkit with Google AI (Gemini) for adaptive content generation (difficulty adjustment, scenario creation).

## UI/UX

*   Bright, cheerful, and "Fortnite-inspired" color palette.
*   Large, easy-to-read text and interactive buttons.
*   Visual feedback for actions and earning rewards.
*   Responsive design for various screen sizes.
*   Sidebar navigation for easy access to different learning modules.

## Getting Started

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/lalomorales22/maximus-learns-stuff.git
    cd maximus-learns-stuff
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project. You may need to add API keys for Genkit/Google AI if you are using those features.
    Example `.env`:
    ```
    # For Genkit with Google AI (Gemini)
    # GOOGLE_API_KEY=your_google_api_key_here
    ```

### Running the Development Server

1.  **Start the Next.js development server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
    This will typically start the application on `http://localhost:9002`.

2.  **(Optional) Start the Genkit development server (if using AI features):**
    In a separate terminal:
    ```bash
    npm run genkit:dev
    # or
    # yarn genkit:dev
    ```
    This allows for local testing and development of Genkit flows.

## Project Structure

*   `src/app/`: Contains the Next.js App Router pages and layouts.
    *   `src/app/learn/`: Contains pages for each learning module.
    *   `src/app/learn/images/`: Contains static images used in the learning modules.
*   `src/components/`: Reusable React components.
    *   `src/components/ui/`: ShadCN UI components.
    *   `src/components/game/`: Components related to game mechanics (scoring, module cards).
    *   `src/components/layout/`: Layout components (header, sidebar).
    *   `src/components/[module]/`: Components specific to each learning module (e.g., `math-module.tsx`).
*   `src/ai/`: Contains Genkit related code.
    *   `src/ai/flows/`: Genkit flows for AI-powered features.
    *   `src/ai/genkit.ts`: Genkit initialization.
*   `src/lib/`: Utility functions, constants, and type definitions.
*   `src/contexts/`: React context providers (e.g., `ScoreContext.tsx`).
*   `public/`: Static assets.

## Customization

*   **Theme**: Colors and styles can be customized in `src/app/globals.css` and `tailwind.config.ts`.
*   **Content**: Math problems, reading passages, and typing texts can be modified in `src/lib/game-utils.ts` or by adjusting the AI prompts in `src/ai/flows/`.
*   **New Modules**: New learning modules can be added by creating a new page in `src/app/learn/`, a corresponding component in `src/components/`, and updating `src/lib/constants.ts`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.
