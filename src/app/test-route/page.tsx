"use client"

import { signIn, signOut, useSession } from "next-auth/react"
 
export default function Dashboard() {
  const { data: session } = useSession()
 
  if (session?.user?.jobTitle ) {
    return( <div>
      {session?.user?.jobTitle}
      <button onClick={() => signOut()}>Sign Out</button>
      </div>)
  }
 
  return <div> <button onClick={() => signIn()}>Sign In</button></div>
}