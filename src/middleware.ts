import { sequence } from "astro:middleware";
import { defineMiddleware } from "astro:middleware";

// import { Ratelimit } from "@upstash/ratelimit";
// import { Redis } from "@upstash/redis/cloudflare";

// Rate limit 3 postings in a week via the web for a user

// const env = {
//   UPSTASH_REDIS_REST_URL: import.meta.env["UPSTASH_REDIS_REST_URL"],
//   UPSTASH_REDIS_REST_TOKEN: import.meta.env["UPSTASH_REDIS_REST_TOKEN"],
// };

// const ratelimit = new Ratelimit({
//   redis: Redis.fromEnv(env),
//   limiter: Ratelimit.fixedWindow(3, "604800 s"), //7 * 24 * 60 * 60 + ' s' (one week	in seconds)
// });

// const returnResponse = (statusCode: number, message: string) => {
//   return new Response(`<html><head></head><body>${message}</body></html>`, {
//     status: statusCode,
//     headers: {
//       "content-type": "text/html",
//     },
//   });
// };

const validation = defineMiddleware(async (context, next) => {
  // if (context.request.url === "/creadit") {
  //   // Get client ip address
  //   const ipAddress = context.clientAddress;
  //   if (ipAddress) {
  //     try {
  //       // Apply user rate limiting first
  //       const { success: userLimitRemains } = await ratelimit.limit(ipAddress);
  //       // If user rate limiting allows it
  //       if (userLimitRemains) {
  //         // Apply total rate limiting next
  //         return await next();
  //         // If total rate limit doesn't allow it
  //       } else {
  //         return returnResponse(
  //           403,
  //           `<span>Hourly limit for all users exceeded. Please try again later.<br />`,
  //         );
  //       }
  //     } catch (e) {
  //       console.log(e);
  //       return returnResponse(500, "Something went wrong");
  //     }
  //   }
  //   // If the IP Address is not recevied, return with a 500
  //   else {
  //     return returnResponse(500, "Your IP Address is non-identifiable.");
  //   }
  // } else {
  console.log(new URL(context.request.url).pathname);
  return await next();
  //}
});

export const onRequest = sequence(validation);
