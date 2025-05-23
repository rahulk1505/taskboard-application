# taskboard-application

🧠 Task Management Board
A fully interactive Task Management Board built with Next.js (App Router) and React, featuring drag-and-drop support, dynamic columns, and real-time task management. Ideal for teams or individuals to track progress on software development tasks.


✨ Features
➕ Add tasks dynamically to any column

📦 Create custom columns (e.g. "Need to Start", "In Progress", "Completed")

🧲 Drag and Drop tasks across columns using intuitive UI

🔄 Auto-update column data with persistent backend cache

🔍 Search tasks instantly across the board

💽 Backend connected to Upstash Redis (cache-based DB)

🎨 Beautiful and responsive UI with Tailwind CSS

🛠️ Tech Stack
Tech	Description 

Next.js	Full-stack React framework (App Router),
React	Frontend UI,
Tailwind CSS	Utility-first styling,
TypeScript	Static type checking,
Upstash Redis	Fast cloud-based caching DB,
Vercel	CI/CD and Hosting Platform,
Dnd-kit	Drag-and-drop interaction library


🚀 Getting Started Locally
bash
Copy
Edit
# 1. Clone the repository
git clone https://github.com/rahulk1505/taskboard-application.git

# 2. Navigate to project
cd taskboard-application

# 3. Install dependencies
npm install

# 4. Run the development server
npm run dev
Visit http://localhost:3000 in your browser.

🧩 Folder Structure
bash
Copy
Edit
/app          -> Next.js App Router pages (API + UI)
/components   -> Reusable UI components (Columns, Tasks)
/services     -> Reusable CRUD methods (REST calls)
/lib/db.ts    -> Redis DB client configuration (Upstash)
🔒 Environment Setup
Create a .env.local file and add your Upstash Redis credentials:


## 🖥️ User Interface (UI)

Here is a screenshot of the Task Management Board:
![Task Board UI](./server/public/UI_image.png)


## 🎥 Demo: Drag & Drop and Task Search

[Click to watch the demo](./server/public/DemoVideo.mp4)

📬 Feedback
If you have suggestions or found issues, feel free to submit a PR or open an issue.

📄 License
This project is licensed under the MIT License.