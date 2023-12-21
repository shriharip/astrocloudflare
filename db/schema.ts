import {
  text,
  integer,
  sqliteTable,
  uniqueIndex,
  index,
} from "drizzle-orm/sqlite-core";

import { sql, relations } from "drizzle-orm";

export const users = sqliteTable(
  "users",
  {
    id: integer("id", { mode: "number" })
      .primaryKey({ autoIncrement: true })
      .unique(),
    fullName: text("full_name"),
    anonymous: integer("anonymous", { mode: "boolean" }),
    email: text("email"),
    userName: text("user_name"),
    phone: text("phone"),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    notifications: text("notifications"),
    ip: text("ip"),
    upvoteIds: text("upvotes", { mode: "json" }),
    saveIds: text("saves", { mode: "json" }),
    email_code: text("email_code"),
    updatedAt: text("updated_at"),
    deletedAt: text("deleted_at"),
  },
  (table) => {
    return {
      emailIdx: index("email_idx").on(table.email),
    };
  },
);

export const listings = sqliteTable(
  "listings",
  {
    id: integer("id", { mode: "number" })
      .primaryKey({ autoIncrement: true })
      .unique(),
    title: text("title"),
    url: text("url"),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    userId: integer("user_id", { mode: "number" }),
    categoryId: integer("category_id"),
    domainId: integer("domain_id"),
    status: text("status"),
    updatedAt: text("updated_at"),
    deletedAt: text("deleted_at"),
    upvotes: integer("likes", { mode: "number" }),
    saves: integer("saves", { mode: "number" }),
    infoId: integer("info_id", { mode: "number" }),
  },
  (table) => {
    return {
      userIdIdx: index("user_id_idx").on(table.userId),
      categoryIdIdx: index("category_id_idx").on(table.categoryId),
      domainIdIdx: index("domain_id_idx").on(table.domainId),
      infoIdIdx: index("info_id_idx").on(table.infoId),
    };
  },
);

export const categories = sqliteTable(
  "categories",
  {
    id: integer("id", { mode: "number" })
      .primaryKey({ autoIncrement: true })
      .unique(),
    catg: text("category"),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at"),
    deletedAt: text("deleted_at"),
  },
  (table) => {
    return {
      catgIdx: uniqueIndex("catg_idx").on(table.catg),
    };
  },
);

export const domains = sqliteTable(
  "domains",
  {
    id: integer("id", { mode: "number" })
      .primaryKey({ autoIncrement: true })
      .unique(),
    domain: text("name"),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at"),
    deletedAt: text("deleted_at"),
  },
  (table) => {
    return {
      domainIdx: uniqueIndex("domain_idx").on(table.domain),
    };
  },
);

// export const messages = sqliteTable(
//   "messages",
//   {
//     id: integer("id", { mode: "number" })
//       .primaryKey({ autoIncrement: true })
//       .unique(),
//     content: text("content"),
//     createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
//     updatedAt: text("updated_at"),
//     deletedAt: text("deleted_at"),
//     userId: integer("user_id", { mode: "number" }),
//     roomId: integer("room_id", { mode: "number" }),
//     listingId: integer("listing_id", { mode: "number" }),
//   },
//   (table) => {
//     return {
//       userIdIdx: index("user_id_idx").on(table.userId),
//       listingIdIdx: index("listing_id_idx").on(table.listingId),
//       roomIdIdx: index("room_id_idx").on(table.roomId),
//     };
//   },
// );

export const contact = sqliteTable(
  "contact",
  {
    id: integer("id", { mode: "number" })
      .primaryKey({ autoIncrement: true })
      .unique(),
    email: text("email"),
    name: text("name"),
    message: text("message"),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at"),
    deletedAt: text("deleted_at"),
  },
  (table) => {
    return {};
  },
);

export const infos = sqliteTable(
  "infos",
  {
    id: integer("id", { mode: "number" })
      .primaryKey({ autoIncrement: true })
      .unique(),
    content: text("content"),
    onOfferContent: text("on_offer_content"),
    priceInfo: text("price_info"),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at"),
    deletedAt: text("deleted_at"),
    listingId: integer("listing_id", { mode: "number" }),
  },
  (table) => {
    return {
      listingIdIdx: index("listing_id_idx").on(table.listingId),
    };
  },
);

// export const roomDetails = sqliteTable(
//   "rooms",
//   {
//     id: integer("id", { mode: "number" })
//       .primaryKey({ autoIncrement: true })
//       .unique(),
//     createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
//     updatedAt: text("updated_at"),
//     deletedAt: text("deleted_at"),
//   },
//   (table) => {
//     return {};
//   },
// );

export const listCatgRelations = relations(listings, ({ one }) => ({
  category: one(categories, {
    fields: [listings.categoryId],
    references: [categories.id],
  }),
}));

export const listDomRelations = relations(listings, ({ one }) => ({
  domain: one(domains, {
    fields: [listings.domainId],
    references: [domains.id],
  }),
}));

export const listInfoRelations = relations(listings, ({ one }) => ({
  info: one(infos, {
    fields: [listings.infoId],
    references: [infos.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  listings: many(listings),
}));

export const listingRelations = relations(listings, ({ one }) => ({
  author: one(users, {
    fields: [listings.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type Listing = typeof listings.$inferSelect;
