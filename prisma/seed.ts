import { hash } from "bcrypt";
import { config } from "dotenv";
import { Client } from "pg";

config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  await client.connect();

  const hashedPassword = await hash("admin", 10);
  const now = new Date();

  // Create Admin user
  await client.query(
    `
    INSERT INTO "User" (id, email, name, password, type, "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (email) DO NOTHING
    `,
    ["1", "admin@admin.com", "Admin", hashedPassword, "Admin", now, now]
  );

  // Add to Admin table
  await client.query(
    `
    INSERT INTO "Admin" (adminId)
    VALUES ($1)
    ON CONFLICT DO NOTHING
    `,
    ["1"]
  );

  // Create Post
  await client.query(
    `
    INSERT INTO "Post" (
      title,
      content,
      "authorId",
      images,
      "createdAt",
      "updatedAt"
    ) VALUES (
      $1, $2, $3, 
      ARRAY[$4, $5, $6, $7, $8]::VARCHAR(255)[],
      $9, $10
    )
    ON CONFLICT DO NOTHING
    `,
    [
      "Mental Health Awareness Week",
      "Let us celebrate the university week with mental help awareness through our webinar titled 'Healthy Mind, Healthy Soul'. Join Us!",
      "1",
      "/images/mental1.png",
      "/images/mental2.jpg",
      "/images/mental3.webp",
      "/images/lcupBg.png",
      "/images/lcup.png",
      now,
      now,
    ]
  );

  console.log("✅ Admin user and post created (if not already exists)");

  await client.end();
}

main().catch((err) => {
  console.error("❌ Error during seeding:", err);
  client.end();
});
