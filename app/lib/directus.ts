import { createDirectus, rest } from "@directus/sdk";

const directus = createDirectus(process.env.DIRECTUS_URL || '').with(rest());

// console.log(process.env.DIRECTUS_URL)



export default directus;