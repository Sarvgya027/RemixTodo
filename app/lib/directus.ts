import { auth, authentication, createDirectus, rest } from "@directus/sdk";
import { json } from "@remix-run/node";

const directus = createDirectus(process.env.DIRECTUS_URL || '').with(rest()).with(authentication('json'));

// console.log(process.env.DIRECTUS_URL)

export default directus;