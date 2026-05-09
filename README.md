# 🌟 Meridian — AI-Powered Project Management

Meridian is a modern, AI-first project management and engineering operations platform. It demonstrates a **fully serverless, static architecture** that runs entirely in the browser, powered by **React** and the **Groq API**. 

Unlike traditional platforms, Meridian has no backend server or database. It uses static JSON files as a read-only database, browser `localStorage` for state mutations, and a global AI engine that adapts its persona based on the context of the user's current view.

---

## 🚀 Technologies

### Frontend & Architecture
- **React 18** (Standalone via CDN)
- **Babel Standalone** (In-browser JSX compilation)
- **Vanilla CSS** (Custom design system, CSS variables)
- **Serverless / Zero-Backend Architecture**

### AI Engine
- **Groq API** (Llama 3.3 70B Versatile) - Provides instant, high-speed inference
- **Client-side Orchestration** - AI prompts and context are built and executed entirely in the browser.

### ☁️ Hosting
- **Azure Static Web Apps** - Automatically deployed via GitHub Actions.

---

## ✨ Key Features

### 🧠 Context-Aware Global AI (`ai-engine.jsx`)
Meridian features a ubiquitous AI assistant that changes its "role" depending on what you are looking at:
- **Sprint Coach**: Summarizes iterations and identifies blockers.
- **PR Analyst**: Reviews pull requests and estimates merge risks.
- **Compute Analyst**: Suggests GPU optimization and spots cost savings.
- **Docs Writer**: Drafts Engineering ADRs and retrospective documents.

### 💻 Embedded VS Code AI Agent
A fully functional, in-browser code editor simulation:
- **Autonomous File Management**: The AI can create, edit, and read HTML/CSS/JS files.
- **Sandboxed Execution**: JavaScript files are executed in a secure browser `iframe`, and the `console.log` output is piped back to the simulated terminal. HTML files render live previews.
- **Simulated Terminal**: The agent can use a `run_command` tool to simulate terminal behavior, creating a realistic local development environment entirely in the browser.

### 🗄️ "Serverless" Static Database
- Data is fetched directly from static JSON files (`/backend/data/*.json`).
- Any user actions (creating an issue, approving a PR) are saved as "deltas" in the browser's `localStorage` and seamlessly merged with the static JSON data upon rendering, simulating a full CRUD backend without any server infrastructure.

---

## ☁️ Deployment on Azure

This project is optimized for deployment on the **Azure Static Web Apps (Free Tier)**.

Because Meridian has no backend, the deployment process is extremely fast. Azure simply copies the `Frontend2/` directory and serves it directly through its global CDN.

1. Connect your GitHub repository to Azure Static Web Apps.
2. Set the `app_location` to `"./Frontend2"`.
3. Set the `api_location` to `""` (Leave empty).
4. **Push to main** – GitHub Actions will automatically deploy the app in seconds.

---

## ⚙️ How to configure the AI (Groq API Key)

Since Meridian is 100% frontend and has no backend server, **you do not need a `.env` file on the server**.

To use the AI features:
1. Open your deployed Meridian application in the browser.
2. Go to the **Settings** view (or open the embedded **VS Code** view).
3. Paste your `gsk_...` **Groq API Key** into the API Key input field.
4. The key is securely saved in your browser's `localStorage` and will be used directly to communicate with Groq.

---

## 🛠️ Local Development

You don't need `npm`, Node.js, or Python to run this project locally!

1. Clone the repository.
2. Open the `Frontend2` directory.
3. Start any basic local web server. For example:
   ```bash
   npx serve .
   ```
   Or using Python:
   ```bash
   python -m http.server 8000
   ```
4. Open `http://localhost:8000/Meridian.html` in your browser.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
