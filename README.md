💻 devTinder — A “Tinder for Devs”
Connect with like-minded developers, match based on shared interests/skills, and collaborate on side projects, startups, or hackathons.

🧠 What is devTinder?
devTinder is a social platform that enables developers to discover and connect with other devs based on their tech stacks, interests, and goals. Think Tinder — but for collaboration instead of dating.

This repository (devTinderB) contains the backend code for the application. The frontend is yet to be developed and will be added in a separate repository.

🛠 Tech Stack (Backend)
- Node.js + Express.js
- MongoDB (Mongoose)
- JWT Authentication
- RESTful API Design


📂 Project Structure
```
devTinderB/
├── config/           # DB & middleware configuration
├── models/           # Mongoose schemas
├── routes/           # Route Handlers
├── utils/            # Utility functions (validation)
├── middleware/       # Auth middleware
├── app.js         # Entry point
└── package.json
```

⚙️ Getting Started
1. Clone the Repository
```bash
git clone https://github.com/Chhavi41/devTinderB.git
cd devTinderB
```

2. Install Dependencies
```bash
npm install
```

3. Configure Environment Variables
Create a .env file based on .env.example:
env
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
4. Run the Development Server
```bash
npm run dev
```
The backend will run on http://localhost:5000.

