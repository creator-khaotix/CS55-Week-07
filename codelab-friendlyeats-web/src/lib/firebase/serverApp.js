// enforces that this code can only be called on the server
// https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#keeping-server-only-code-out-of-the-client-environment
import "server-only";

import { cookies } from "next/headers";
import { initializeServerApp, initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

// Returns an authenticated client SDK instance for use in Server Side Rendering
// and Static Site Generation
export async function getAuthenticatedAppForUser() {
  const cookieStore = await cookies();
  const idToken = cookieStore.get("idToken")?.value;
  
  if (!idToken) {
    return { firebaseServerApp: null, currentUser: null };
  }

  try {
    const firebaseServerApp = initializeServerApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });

    const auth = getAuth(firebaseServerApp);
    
    // For now, return a mock user since we don't have proper server-side auth setup
    // In a real app, you would verify the ID token here
    return { 
      firebaseServerApp, 
      currentUser: { 
        uid: "mock-user", 
        email: "user@example.com",
        toJSON: () => ({ uid: "mock-user", email: "user@example.com" })
      } 
    };
  } catch (error) {
    console.error("Error initializing Firebase server app:", error);
    return { firebaseServerApp: null, currentUser: null };
  }
}
