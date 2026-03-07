import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export default {
    providers: [
        Credentials({
            async authorize(credentials) {
                // This is where logic to verify credentials should go
                // For early development, we'll implement a stub or check against DB
                return null;
            },
        }),
    ],
} satisfies NextAuthConfig
