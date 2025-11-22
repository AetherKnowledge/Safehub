// lib/supabaseClient.ts
import { createBrowserClient } from "@supabase/ssr";
import { env } from "next-runtime-env";

export function createClient(supabaseAccessToken: string) {
  const supabaseClient = createBrowserClient(
    env("NEXT_PUBLIC_SUPABASE_URL")!,
    env("NEXT_PUBLIC_SUPABASE_ANON_KEY")!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${supabaseAccessToken}`,
        },
      },
    }
  );

  supabaseClient.realtime.setAuth(supabaseAccessToken);

  return supabaseClient;
}

export enum Buckets {
  Capstone = "capstone",
  Posts = "posts",
  Hotline = "hotline",
  Documents = "documents",
}

export function getBucket(bucketName: Buckets, supabaseAccessToken: string) {
  return createClient(supabaseAccessToken).storage.from(bucketName);
}
