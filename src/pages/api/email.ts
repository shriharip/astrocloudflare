import type { APIRoute, APIContext } from "astro";
import * as schema from "../../../db/schema";
import { users } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { resend } from "@/resend";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const client = createClient({
  url: import.meta.env.DEV
    ? import.meta.env.TURSO_URL
    : import.meta.env.TURSO_PROD_URL,
  authToken: import.meta.env.DEV
    ? import.meta.env.TURSO_AUTH_TOKEN
    : import.meta.env.TURSO_PROD_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

export const POST: APIRoute = async (context: APIContext) => {
  const data = Object.fromEntries(await context.request.formData());
  const id = context.url.searchParams.get("listing");
  const ip = context.clientAddress;

  const code = Math.random().toString(36).slice(4);
  const email = data["email"] as string;

  try {
    let user;

    const result = await db.select().from(users).where(eq(users.email, email));

    if (result.length > 0) {
      user = result[0];
    }
    if (!user) {
      user = (
        await db
          .insert(users)
          .values({
            email: data["email"] as string,
            ip: ip,
            anonymous: false,
          })
          .returning()
      )[0];
    }

    if (user) {
      await db
        .update(users)
        .set({
          email_code: code,
        })
        .where(eq(users.id, user.id));

      const data = await resend.emails.send({
        to: email,
        from: "onboarding@resend.dev",
        subject: "Sponsor.rs Email Verification",
        html: `<p>Hi there,</p>
    		<p>Thanks for signing up for Sponsor.rs! Please verify your email by clicking the link below.</p>
    		<p><a href="https://sponsor.rs/email_code?code=${code}&email=${email}&listing=${id}">Verify Email</a></p>
    		<br />
    		<p>or , you can paste the code ${code} at <span>
    		<a href="https://sponsor.rs/email_code?listing=${id}&email=${email}">https://sponsor.rs/email_code</a></span></p>
    		<br />
    		<p>If you did not sign up for Sponsor.rs, please ignore this email.</p>
    		<p>Thanks,</p>
    		<p>Sponsor.rs</p>`,
      });
      console.log(data);
    }
  } catch (e) {
    console.log(e);
  }

  return context.redirect("/email_code?listing=" + id + "&email=" + email);
};
