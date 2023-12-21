import type { APIRoute, APIContext } from "astro";
import * as schema from "../../../db/schema";
import { contact } from "../../../db/schema";
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
  console.log(data, "data from api");

  const ip = context.clientAddress;

  try {
    await db.insert(contact).values({
      name: (data["name"] as string) || "anonymous",
      email: (data["email"] as string) || "john@example.com",
      message: data["message"] as string,
    });

    return new Response(
      JSON.stringify({
        message: "Received",
      }),
      {
        status: 200,
      },
    );
  } catch (e) {
    console.log(e);
  }
  return new Response(
    JSON.stringify({
      message: "something went wrong",
    }),
    {
      status: 500,
    },
  );
};
