import { fileTypeFromBuffer } from "file-type";
import fs from "fs";
import { writeFile } from "fs/promises";
import { join } from "path";

const storageDir = join(process.cwd(), "public", "storage");

function getImages() {
  // Only run on server
  const files = fs.readdirSync(storageDir);
  // Filter for image files (basic extension check)
  return files.filter((f) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(f));
}

const Test = () => {
  const images = getImages();

  async function upload(formData: FormData) {
    "use server";

    const file: File | null = formData.get("file") as unknown as File;
    if (!file || !(file instanceof File) || file.size === 0) {
      throw new Error("No file uploaded");
    }

    // Check MIME type and extension
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only image files are allowed");
    }
    if (!/\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)) {
      throw new Error("File extension not allowed");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate actual file type using magic bytes
    const type = await fileTypeFromBuffer(buffer);
    if (!type || !type.mime.startsWith("image/")) {
      throw new Error("Uploaded file is not a valid image");
    }

    // Here you would typically save the buffer to a storage solution
    const rootDir = process.cwd();
    const ext = type?.ext || "bin";
    const filename = crypto.randomUUID() + "." + ext;
    const path = join(rootDir, "public", "storage", filename);
    await writeFile(path, buffer);
  }

  return (
    <div>
      <h1>Upload Test</h1>
      <form action={upload}>
        {/* Limit file input to images only */}
        <input
          type="file"
          name="file"
          accept="image/jpeg,image/png,image/gif,image/bmp,image/webp"
        />
        <button type="submit">Upload</button>
      </form>
      <h2>Images in storage:</h2>
      <div>
        {images.map((img) => (
          <img
            key={img}
            src={`/storage/${img}`}
            alt={img}
            style={{ maxWidth: "200px", margin: "10px" }}
          />
        ))}
      </div>
    </div>
  );
};

export default Test;
