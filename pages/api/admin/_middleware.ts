import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
//import { jwt } from "utils";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
	const session: any = await getToken({
		req,
		secret: process.env.NEXTAUTH_SECRET,
	});

	if (!session) {
		return new Response(JSON.stringify({ message: "Not authorized" }), {
			status: 401,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	const validRoles = ["admin", "super-user", "SEO"];

	if (!validRoles.includes(session.user.role)) {
		return new Response(JSON.stringify({ message: "Not authorized" }), {
			status: 401,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	return NextResponse.next();

	//const { token = "" } = req.cookies;
	// try {
	// 	await jwt.isValidToken(token);
	// 	return NextResponse.next();
	// } catch (error) {
	// 	const url = req.nextUrl.clone();
	// 	url.pathname = "/auth/login";
	// 	url.search = `p=${req.page.name}`;
	// 	return NextResponse.redirect(url);
	// }
}
