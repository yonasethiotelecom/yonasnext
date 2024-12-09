 "use server"

import { auth, signIn, signOut } from "@/auth";
import { SignIn } from "./signIn";
import { SignOut } from "./signOut";

export default async function Home() {
  const session = await auth();

  if (!session) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">Welcome to Our App</h1>
       <SignIn/>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold">Home Page</h1>
      <section className="mt-4">
        <h2 className="text-xl font-semibold">Session Details:</h2>
        <pre className="p-4 bg-gray-100 rounded-md">
          {JSON.stringify(session, null, 2)}
        </pre>
      </section>
      <div className="mt-6">
        {/* Placeholder for additional content or components */}
      </div>
     <SignOut/>
    
    </main>
  );
}
