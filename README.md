# WasteIQ Baripada - Smart Waste Management

WasteIQ is a comprehensive smart waste management platform built for Baripada. It uses AI, real-time sensor data, and gamification to connect citizens, sanitation workers, and municipal admins.

## 🚀 Getting Started

### 1. Local Development
First, install the dependencies:
```bash
npm install
```

Then, run the development server:
```bash
npm run dev
```

### 2. Environment Variables
Ensure you have your Firebase and Google AI credentials in a `.env` file (this file is ignored by Git for security):
```env
GOOGLE_GENAI_API_KEY=your_api_key_here
```

## 📤 Publishing to GitHub

1. **Create a new repository** on [GitHub](https://github.com/new). Do not initialize it with a README.
2. **Open your terminal** in this project folder and run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: WasteIQ Smart Waste Management"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

## 🌐 Deployment (Firebase App Hosting)

This project is configured for **Firebase App Hosting** (see `apphosting.yaml`). 

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Navigate to **Build > App Hosting**.
3. Click **Get Started** and connect your GitHub repository.
4. Select your repository and the `main` branch.
5. Firebase will automatically build and deploy your app every time you push to GitHub.

## 🛠 Tech Stack
- **Framework**: Next.js (App Router)
- **AI**: Google Genkit (Gemini 2.5 Flash)
- **Backend**: Firebase (Auth, Firestore)
- **UI**: Tailwind CSS + ShadCN UI
- **Icons**: Lucide React