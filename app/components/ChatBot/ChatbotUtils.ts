export function cleanN8nAIOutput(content: string) {
  if (!content) return content;

  return (
    content
      // remove tool blocks
      .replace(/\[Used tools:[\s\S]*?\]/g, "")
      // remove leftover JSON garbage like "}]}]]"
      .replace(/^[\s"}\]\[]+/g, "")
      // trim whitespace
      .trim()
  );
}
