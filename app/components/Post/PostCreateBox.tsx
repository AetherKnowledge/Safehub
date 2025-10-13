import { createPost } from "../../pages/Post/PostActions";

const PostCreateBox = () => {
  return (
    <form
      action={createPost}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: 400,
      }}
      className="card bg-base-100 shadow-br p-4 mx-auto my-8 text-base-content"
    >
      <label>
        Title:
        <input
          type="text"
          name="title"
          placeholder="Enter post title"
          maxLength={100}
          minLength={1}
          className="input input-bordered input-primary w-full focus-within:outline-none ring-0"
          required
        />
      </label>
      <label>
        Content:
        <textarea
          name="content"
          className="textarea textarea-bordered textarea-primary w-full focus-within:outline-none ring-0"
          placeholder="Enter post content"
          maxLength={500}
          minLength={1}
          rows={4}
          required
        />
      </label>
      <label>
        Images:
        <input
          type="file"
          className="file-input file-input-bordered file-input-primary w-full max-w-xs"
          name="images"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple
        />
      </label>
      <button className="btn btn-primary" type="submit">
        Create Post
      </button>
    </form>
  );
};

export default PostCreateBox;
