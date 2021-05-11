import { withIronSession } from 'next-iron-session';

export function withSession(handler: any) {
  return withIronSession(handler, {
    password:
      process.env.NEXT_PUBLIC_SESSION_PASSWORD ||
      'mfjwi[qmwbf829jdn321nbq12el12',
    cookieName: 'talaria-order-cookie',
    cookieOptions: {
      // the next line allows to use the session in non-https environments like
      // Next.js dev mode (http://localhost:3000)
      secure: false,
    },
  });
}
