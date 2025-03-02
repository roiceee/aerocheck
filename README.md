# Aerocheck  

## Overview  
**Aerocheck** is an internal digital preflight checklist system designed for pilots and mechanics to collaboratively verify aircraft conditions before takeoff.  

## Tech Stack  
- **Frontend:** React (Vite) + TypeScript  
- **Backend:** Supabase (Cloud)  
- **Authentication:** Supabase Google OAuth  
- **PWA:** Vite PWA Plugin  
- **Deployment:** Frontend on Vercel, Backend on Supabase Cloud  

## Setup & Installation  
1. Clone the repository:  
   ```sh
   git clone <repo-url>
   cd aerocheck
   ```  
2. Install dependencies:  
   ```sh
   npm install  # or pnpm install
   ```  
3. Set up environment variables:  
   - Copy `.env.example` to `.env` and update the values accordingly.  
   - The app relies on a Supabase Cloud backend, so ensure you have the correct API keys and database settings.  

## Running the App  
For development:  
```sh
npm run dev
```  
Then open [http://localhost:5173](http://localhost:5173) in your browser.  

## Deployment  
- **Frontend:** Deployed via Vercel.  
- **Backend:** Managed on Supabase Cloud.  
- **CI/CD:** Standard Vercel deployment from the main branch.  

## Usage  
- Pilots and mechanics log in via Google OAuth.  
- Users can collaboratively complete and verify aircraft checklists before takeoff.  
- Data is stored in Supabase for record-keeping.  

## Troubleshooting  
- Ensure all `.env` variables are correctly set.  
- Check Supabase logs for backend issues.  
- Use browser dev tools for PWA debugging.  

## Maintainer  
This project is currently maintained by [John Roice Aldeza](https://github.com/roiceee).
