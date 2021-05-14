import { withIronSession } from 'next-iron-session';

export function withSession(handler: any) {
  return withIronSession(handler, {
    password: process.env.NEXT_PUBLIC_SESSION_PASSWORD!,
    cookieName: 'talaria-order-cookie',
    cookieOptions: {
      // the next line allows to use the session in non-https environments like
      // Next.js dev mode (http://localhost:3000)
      secure: true,
      httpOnly: true,

      domain:
        process.env.NODE_ENV === 'production'
          ? '.talaria-order.xyz'
          : undefined,
    },
  });
}
