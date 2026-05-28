Deno.serve(() => {
  return new Response("SafeHub edge functions are running", {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
});
