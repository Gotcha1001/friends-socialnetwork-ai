/** @type {import("drizzle-kit").Config} */
export default {
  schema: "./configs/schema.js",
  dialect: "postgresql",

  //NEW ONE
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_hzDZkKc2fvl4@ep-white-dew-a8z2h4o0-pooler.eastus2.azure.neon.tech/friends-ai-social?sslmode=require&channel_binding=require",
  },
};

//FULL ONE OLD

//   dbCredentials: {
//     url: "postgresql://neondb_owner:npg_hzDZkKc2fvl4@ep-white-dew-a8z2h4o0-pooler.eastus2.azure.neon.tech/language-learning?sslmode=require&channel_binding=require",
//   },
// }
