# 🧠 Socket.io Chat App

A real-time chat application built with **React**, **Express**, and **Socket.io**, supporting live messaging, typing indicators, private messaging, and user presence tracking.

---

## 🚀 Features

- 🔁 **Real-time Messaging** between users
- 👤 **User Presence**: Displays who is online
- ✉️ **Private Messaging** between users
- ✍️ **Typing Indicators** when a user is composing a message
- 📢 **Join/Leave Notifications**
- 🔒 Simple **Username-based Authentication**

---

## 📁 Project Structure

```
socketio-chat/
├── client/ # React front-end
│ ├── src/
│ │ ├── components/ # UI components
│ │ ├── context/ # Socket context provider
│ │ ├── hooks/ # Custom socket hook
│ │ ├── pages/ # Page views
│ │ ├── socket/ # Socket.io client setup
│ │ ├── App.jsx
│ │ └── main.jsx
│ └── package.json
├── server/ # Express + Socket.io back-end
│ ├── server.js
│ └── package.json
└── README.md
```


---

## ⚙️ Getting Started

### 🧱 Prerequisites

- Node.js v18+
- npm or yarn

### 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/socketio-chat-app.git
cd socketio-chat-app
```
Install server dependencies: 
```
cd server
npm install
```

Install client dependencies:
```
cd ../client
npm install
```
🧪 Run the App
Start the back-end (server):

```
cd server
npm run dev
```

Start the front-end (React client):
```
cd client
npm run dev
```
Then visit 👉 http://localhost:5173

✨ Advanced Features Implemented

✅ Typing indicators
✅ Private messaging
✅ Real-time online user list
✅ Chat history and timestamps
