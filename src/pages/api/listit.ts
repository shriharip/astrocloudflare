import type { APIRoute, APIContext } from "astro";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../../../db/schema";
import { users, listings, infos } from "../../../db/schema";
import { eq } from "drizzle-orm";
import type { IFeedExplore } from "@/types";
// import { client as posthog } from "@/posthog";

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
  const ip = context.clientAddress;

  try {
    const email = data["email"] as string;
    let user;
    if (!email) {
      user = (
        await db
          .insert(users)
          .values({
            anonymous: true,
            ip: ip,
          })
          .returning()
      )[0];
    } else {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

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
    }

    const info = (
      await db
        .insert(infos)
        .values({
          content: data["content"] as string,
          onOfferContent: data["onOffer"] as string,
          priceInfo: data["priceInfo"] as string,
        })
        .returning()
    )[0];

    const listing = (
      await db
        .insert(listings)
        .values({
          title: data["name"] as string,
          url: data["website"] as string,
          categoryId: parseInt(data["category"] as string),
          domainId: parseInt(data["domain"] as string),
          infoId: info?.id,
          userId: user?.id,
        })
        .returning()
    )[0];

    if (info && info.id) {
      let id = info.id;
      await db
        .update(infos)
        .set({ listingId: listing?.id })
        .where(eq(infos.id, id));
    }
  } catch (e) {
    console.log(e);
  }

  return new Response(
    JSON.stringify({
      status: 200,
      body: "list",
    }),
  );
};

export const GET: APIRoute = async (context: APIContext) => {
  let lists: IFeedExplore[] = [];

  const searchParams = context.url.searchParams.get("catg");

  lists = (await db.query.listings.findMany({
    columns: {
      id: true,
      title: true,
      url: true,
      upvotes: true,
      saves: true,
    },
    with: {
      category: {
        columns: {
          id: true,
          catg: true,
        },
      },
      domain: {
        columns: {
          id: true,
          domain: true,
        },
      },
      info: {
        columns: {
          content: true,
          onOfferContent: true,
          priceInfo: true,
        },
      },
      author: {
        columns: {
          id: true,
          email: true,
          anonymous: true,
        },
      },
    },
  })) as IFeedExplore[];

  if (searchParams) {
    let newlists = [];
    newlists = lists.filter((list) => list.category.catg === searchParams);
    return new Response(
      JSON.stringify({
        status: 200,
        body: newlists,
      }),
    );
  }

  return new Response(
    JSON.stringify({
      status: 200,
      body: lists,
    }),
  );
};
