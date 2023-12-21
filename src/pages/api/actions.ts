import type { APIRoute, APIContext } from "astro";
import * as schema from "../../../db/schema";
import { listings, users } from "../../../db/schema";
import { eq } from "drizzle-orm";
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
  const data = await context.request.json();

  const ip = context.clientAddress;

  try {
    if (data.action === "upvote") {
      let upVoteIds: number[] = [];
      const result = await db
        .select({ up: users.upvoteIds })
        .from(users)
        .where(eq(users.email, data.email));

      if (result && result.length > 0) {
        upVoteIds = result[0]?.up as number[];
      } else {
        upVoteIds = [];
      }

      if (upVoteIds && upVoteIds.includes(data.listingId)) {
        upVoteIds = upVoteIds.filter((id) => id !== data.listingId);
        await db
          .update(users)
          .set({
            upvoteIds: upVoteIds,
          })
          .where(eq(users.email, data.email));

        await db
          .update(listings)
          .set({
            upvotes: data.values - 1,
          })
          .where(eq(listings.id, data.listingId));

        return new Response(
          JSON.stringify({
            message: "removed upvote",
          }),
          {
            status: 200,
          },
        );
      } else if (!upVoteIds) {
        upVoteIds = [data.listingId];
      } else {
        upVoteIds.push(data.listingId);
      }

      await db
        .update(users)
        .set({
          upvoteIds: upVoteIds,
        })
        .where(eq(users.email, data.email));

      await db
        .update(listings)
        .set({
          upvotes: data.values + 1,
        })
        .where(eq(listings.id, data.listingId));

      return new Response(
        JSON.stringify({
          message: "upvoted",
        }),
        {
          status: 200,
        },
      );
    } else if (data.action === "save") {
      let savedIds: number[] = [];
      const result = await db
        .select({ saved: users.saveIds })
        .from(users)
        .where(eq(users.email, data.email));

      if (result && result.length > 0) {
        savedIds = result[0]?.saved as number[];
      } else {
        savedIds = [];
      }

      if (savedIds && savedIds.includes(data.listingId)) {
        savedIds = savedIds.filter((id) => id !== data.listingId);
        await db
          .update(users)
          .set({
            saveIds: savedIds,
          })
          .where(eq(users.email, data.email));

        await db
          .update(listings)
          .set({
            saves: data.values - 1,
          })
          .where(eq(listings.id, data.listingId));

        return new Response(
          JSON.stringify({
            message: "removed save",
          }),
          {
            status: 200,
          },
        );
      } else if (!savedIds) {
        savedIds = [data.listingId];
      } else {
        savedIds.push(data.listingId);
      }

      await db
        .update(users)
        .set({
          saveIds: savedIds,
        })
        .where(eq(users.email, data.email));

      await db
        .update(listings)
        .set({
          saves: data.values + 1,
        })
        .where(eq(listings.id, data.listingId));

      return new Response(
        JSON.stringify({
          message: "saved",
        }),
        {
          status: 200,
        },
      );
    }
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
