import { defineCollection, z } from "astro:content";

// Post collection schema
const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    date: z.date().optional(),
    image: z.string().optional(),
    author: z.string().default("Admin"),
    categories: z.array(z.string()).default(["others"]),
    tags: z.array(z.string()).default(["others"]),
    draft: z.boolean().optional(),
  }),
});
// Pages collection schema
const pagesCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

const heroCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    content: z.string().optional(),
    images: z.string().optional().or(z.array(z.string().optional()).optional()),
    enable: z.boolean().optional(),
    button: z
      .object({
        label: z.string(),
        url: z.string().optional(),
        enable: z.boolean().optional(),
      })
      .optional(),
  }),
});

const featuresCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    subtitle: z.string().optional(),
    content: z.string().optional(),
    images: z.string().optional(),
    enable: z.boolean().optional(),
    bulletPoints: z
      .array(
        z.object({
          title: z.string(),
          content: z.string().optional(),
          icon: z.string().optional(),
        }),
      )
      .optional(),
  }),
});

const faqCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    enable: z.boolean().optional(),
    questions: z
      .array(
        z.object({
          title: z.string(),
          content: z.string().optional(),
        }),
      )
      .optional(),
  }),
});

const testimonialsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    enable: z.boolean(),
    content: z.string().optional(),
    values: z
      .array(
        z.object({
          name: z.string().optional(),
          designation: z.string().optional(),
          avatar: z.string().optional(),
          content: z.string().optional(),
        }),
      )
      .optional(),
  }),
});
// const sectionsCollection = defineCollection({
// 	schema: z.array(z.object({
// 		title: z.string(),
// 		content: z.string().optional().or(z.array(z.string().optional()).optional()),
// 		images: z.string().optional().or(z.array(z.string().optional()).optional()),
// 		enable: z.boolean().optional(),
// 		button: z.object({ label: z.string(), url: z.string().optional(), enable: z.boolean().optional() }).optional().or(z.array(z.object({
// 			label: z.string(),
// 			url: z.string().optional(),
// 			enable: z.boolean().optional(),
// 		})).optional()),
// 		bulletPoints: z.array(z.string()).optional(),
// 		testimonials: z.array(z.object({
// 			name: z.string().optional(),
// 			designation: z.string().optional(),
// 			avatar: z.string().optional(),
// 			content: z.string().optional(),
// 		})).optional()
// 	})).or(z.object({
// 		title: z.string(),
// 		meta_title: z.string().optional(),
// 		description: z.string().optional(),
// 		content: z.string().optional().or(z.array(z.string().optional()).optional()),
// 		images: z.string().optional().or(z.array(z.string().optional()).optional()),
// 		draft: z.boolean().optional(),
// 		enable: z.boolean().optional(),
// 		button: z.string().optional().or(z.array(z.object({
// 			label: z.string(),
// 			url: z.string().optional(),
// 			enable: z.boolean().optional(),
// 		})).optional()),
// 		bulletPoints: z.array(z.string()).optional(),
// 		testimonials: z.array(z.object({
// 			name: z.string().optional(),
// 			designation: z.string().optional(),
// 			avatar: z.string().optional(),
// 			content: z.string().optional(),
// 		})).optional()
// 	})).optional(),
// });

const contactCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    draft: z.boolean().optional(),
    enable: z.boolean().optional(),
    button: z
      .string()
      .optional()
      .or(
        z
          .array(
            z.object({
              label: z.string(),
              url: z.string().optional(),
              enable: z.boolean().optional(),
            }),
          )
          .optional(),
      ),
  }),
});

// Export collections
export const collections = {
  blog: blogCollection,
  pages: pagesCollection,
  hero: heroCollection,
  features: featuresCollection,
  testimonials: testimonialsCollection,
  contact: contactCollection,
  faqs: faqCollection,
};
