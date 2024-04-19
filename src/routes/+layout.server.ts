import type { LayoutServerLoad } from './$types'
import LogRocket from 'logrocket';
export const load: LayoutServerLoad = async ({ locals: { getSession } }) => {
  const session = await getSession()
  if (session && session.user) {
    LogRocket.identify(session.user.id, {
      name: session.user.full_name,
      email: session.user.email,
    
      // Add your own custom user variables here, ie:
      subscriptionType: 'pro'
    });
  }
  return {
    session:session
  }
}