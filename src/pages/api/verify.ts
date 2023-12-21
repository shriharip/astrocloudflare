import type { APIRoute, APIContext } from "astro";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "../../../db/schema";

import { users } from "../../../db/schema";
import { eq } from "drizzle-orm";

const client = createClient({
  url: import.meta.env.TURSO_URL,
  authToken: import.meta.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

export const POST: APIRoute = async (context: APIContext) => {
  const data = Object.fromEntries(await context.request.formData());

  const email = context.url.searchParams.get("email") as string;
  const code = data["code"] as string;
  const listingId = context.url.searchParams.get("listing");
  let now = new Date();
  const time = now.getTime();
  const expireTime = time + 1000 * 60 * 60 * 24 * 7; // 7 days
  now.setTime(expireTime);

  try {
    let user;
    const result = await db.select().from(users).where(eq(users.email, email));

    if (result.length > 0) {
      user = result[0];
    }
    if (user) {
      if (user.email_code === code) {
        await db
          .update(users)
          .set({
            email_code: null,
          })
          .where(eq(users.id, user.id));
        if (listingId) {
          context.cookies.set(
            "sponsor",
            {
              email: email,
              listingId: listingId,
              emailVerified: true,
            },
            {
              httpOnly: true,
              path: "/",
              secure: true,
              sameSite: "strict",
              expires: now, // 7 days
            },
          );
          return context.redirect(`/${listingId}`);
        } else {
          return context.redirect(`/`);
        }
      } else {
        return new Response("Invalid code", { status: 400 });
      }
    }
  } catch (e) {
    console.log(e);
  }

  return new Response("OK", { status: 200 });
};
