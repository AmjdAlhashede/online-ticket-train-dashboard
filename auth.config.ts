import type { NextAuthOptions } from 'next-auth';

// This config is used by middleware (Edge Runtime) — NO Prisma here
export const authConfig: NextAuthOptions = {
    pages: {
        signIn: '/login',
    },
    providers: [],
    callbacks: {
        async jwt({ token, user }: { token: any; user?: any }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }: { session: any; token: any }) {
            if (token) {
                session.user.role = token.role;
            }
            return session;
        },
    },
};
