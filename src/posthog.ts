import { PostHog } from "posthog-node";

export const client = new PostHog(import.meta.env.POSTHOG_API_KEY, {
  host: import.meta.env.POSTHOG_HOST,
});
