import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { dbUsers } from "database";
export default NextAuth({
	// Configure one or more authentication providers
	providers: [
		Credentials({
			name: "Custom login",
			credentials: {
				email: {
					label: "email:",
					type: "email",
					placeholder: "your@email.com",
				},
				password: {
					label: "password:",
					type: "password",
					placeholder: "password",
				},
			},
			async authorize(credentials) {
				//return { name: "Juan", email: "juan@email.com", role: "admin" };
				return await dbUsers.checkUserEmailPassword(
					credentials!.email,
					credentials!.password
				);
			},
		}),
		GithubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
		}),
	],

	// callbacks

	callbacks: {
		async jwt({ token, account, user }) {
			if (account) {
				token.accessToken = account.access_token;

				switch (account.type) {
					case "oauth":
						token.user = await dbUsers.oAuthToDbUser(
							user?.email || "",
							user?.name || ""
						);
						break;
					case "credentials":
						token.user = user;
						break;
				}
			}

			return token;
		},

		async session({ session, token, user }) {
			session.accessToken = token.accessToken;
			session.user = token.user as any;

			return session;
		},
	},
});
