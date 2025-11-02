import { hash } from "bcrypt";
import { config } from "dotenv";
import { Client } from "pg";

config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  await client.connect();

  const now = new Date();

  const adminHashedPassword = await hash("admin", 10);
  const adminUUID = "52866741-dc71-4ced-b5ad-993419a730be";

  const counselorHashedPassword = await hash("test", 10);
  const counselorUUID = "52866741-dc71-4ced-b5ad-993419a730bc";

  // ================================
  // Vector Storage Setup
  // ================================

  // Drop function first if it exists
  await client.query(`
    DROP FUNCTION IF EXISTS match_documents (
      query_embedding vector(3072),
      match_count int,
      filter jsonb
    );
  `);

  // Recreate function
  await client.query(`
    CREATE FUNCTION match_documents (
      query_embedding vector(3072),
      match_count int DEFAULT null,
      filter jsonb DEFAULT '{}'
    ) RETURNS TABLE (
      id bigint,
      content text,
      metadata jsonb,
      similarity float
    )
    LANGUAGE plpgsql
    AS $$
    #variable_conflict use_column
    BEGIN
      RETURN QUERY
      SELECT
        id,
        content,
        metadata,
        1 - (documents.embedding <=> query_embedding) AS similarity
      FROM documents
      WHERE metadata @> filter
      ORDER BY documents.embedding <=> query_embedding
      LIMIT match_count;
    END;
    $$;
  `);

  // Grant permissions
  await client.query(`
    GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE documents TO service_role;
  `);

  await client.query(`
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
  `);

  await client.query(`
    GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE "Hotline" TO service_role;
  `);
  await client.query(`
    GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE "Post" TO service_role;
  `);

  // ================================
  // Storage Bucket Setup
  // ================================
  await client.query(`DELETE FROM storage.objects WHERE bucket_id = 'posts';`);
  await client.query(`DELETE FROM storage.buckets WHERE id = 'posts';`);
  await client.query(`
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('posts', 'posts', true)
    ON CONFLICT (id) DO NOTHING;
  `);

  await client.query(
    `DELETE FROM storage.objects WHERE bucket_id = 'hotline';`
  );
  await client.query(`DELETE FROM storage.buckets WHERE id = 'hotline';`);
  await client.query(`
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('hotline', 'hotline', true)
    ON CONFLICT (id) DO NOTHING;
  `);

  // Drop policies if they exist first
  await client.query(
    `DROP POLICY IF EXISTS "Authenticated users can read posts bucket" ON storage.objects;`
  );
  await client.query(
    `DROP POLICY IF EXISTS "Only Admins can insert into post bucket" ON storage.objects;`
  );
  await client.query(
    `DROP POLICY IF EXISTS "Only Admins can update post objects" ON storage.objects;`
  );
  await client.query(
    `DROP POLICY IF EXISTS "Only Admins can delete post objects" ON storage.objects;`
  );

  await client.query(
    `DROP POLICY IF EXISTS "Authenticated users can read hotline bucket" ON storage.objects;`
  );
  await client.query(
    `DROP POLICY IF EXISTS "Only Admins can insert into hotline bucket" ON storage.objects;`
  );
  await client.query(
    `DROP POLICY IF EXISTS "Only Admins can update hotline objects" ON storage.objects;`
  );
  await client.query(
    `DROP POLICY IF EXISTS "Only Admins can delete hotline objects" ON storage.objects;`
  );

  // Recreate policies
  await client.query(`
    CREATE POLICY "Authenticated users can read posts bucket"
    ON storage.objects FOR SELECT
    USING (
      bucket_id = 'posts'
      AND auth.role() = 'authenticated'
    );
  `);

  await client.query(`
    CREATE POLICY "Only Admins can insert into post bucket"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'posts'
      AND public.role() = 'Admin'
    );
  `);

  await client.query(`
    CREATE POLICY "Only Admins can update post objects"
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = 'posts'
      AND public.role() = 'Admin'
    )
    WITH CHECK (
      bucket_id = 'posts'
      AND public.role() = 'Admin'
    );
  `);

  await client.query(`
    CREATE POLICY "Only Admins can delete post objects"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'posts'
      AND public.role() = 'Admin'
    );
  `);

  // Hotline bucket policies
  await client.query(`
    CREATE POLICY "Authenticated users can read hotline bucket"
    ON storage.objects FOR SELECT
    USING (
      bucket_id = 'hotline'
      AND auth.role() = 'authenticated'
    );
  `);

  await client.query(`
    CREATE POLICY "Only Admins can insert into hotline bucket"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'hotline'
      AND public.role() = 'Admin'
    );
  `);

  await client.query(`
    CREATE POLICY "Only Admins can update hotline objects"
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = 'hotline'
      AND public.role() = 'Admin'
    )
    WITH CHECK (
      bucket_id = 'hotline'
      AND public.role() = 'Admin'
    );
  `);

  await client.query(`
    CREATE POLICY "Only Admins can delete hotline objects"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'hotline'
      AND public.role() = 'Admin'
    );
  `);

  console.log("✅ Supabase storage bucket + policies seeded");

  // ================================
  // Admin + Counselor Seeding
  // ================================

  // Enable pgcrypto extension for gen_random_uuid()
  await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

  // Create Admin user
  await client.query(
    `
    INSERT INTO public."User" (id, email, name, password, image, "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (email) DO NOTHING
    `,
    [adminUUID, "admin@admin.com", "Admin", adminHashedPassword, null, now, now]
  );

  await client.query(
    `
    UPDATE public."User"
    SET "type" = 'Admin'
    WHERE id = $1
    `,
    [adminUUID]
  );

  // Add to Admin table
  await client.query(
    `
    INSERT INTO public."Admin" ("adminId")
    VALUES ($1)
    ON CONFLICT DO NOTHING
    `,
    [adminUUID]
  );

  // Create Counselor user
  await client.query(
    `
    INSERT INTO public."User" (id, email, name, password, image, "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (email) DO NOTHING
    `,
    [
      counselorUUID,
      "test@test.com",
      "Test",
      counselorHashedPassword,
      null,
      now,
      now,
    ]
  );

  await client.query(
    `
    UPDATE public."User"
    SET "type" = 'Counselor'
    WHERE id = $1
    `,
    [counselorUUID]
  );

  // Add to Admin table
  await client.query(
    `
    INSERT INTO public."Counselor" ("counselorId")
    VALUES ($1)
    ON CONFLICT DO NOTHING
    `,
    [counselorUUID]
  );

  console.log(
    "✅ Admin user, grants, RLS, and trigger created (if not already exists)"
  );

  console.log("✅ Admin user and post created (if not already exists)");

  await client.end();
}

main().catch((err) => {
  console.error("❌ Error during seeding:", err);
  client.end();
});
