'use client'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export const HomeView = () => {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  if (!session) {
    return <div>Please sign in to access the application.</div>
  }

  return (
    <div className='flex flex-col p-4 gap-y-4'>
      <h1>Home page</h1>
      <Button
        onClick={() =>
          authClient.signOut({
            fetchOptions: {
              onSuccess(context) {
                console.log('Successfully signed out', context)
                router.push('/sign-in')
              }
            }
          })
        }
      >
        Sign out
      </Button>
    </div>
  )
}
