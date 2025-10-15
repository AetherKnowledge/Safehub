"use client";
import { useState } from "react";
import PostModal from "./PostModal";

const AddPostButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        className="btn btn-primary btn-sm"
        onClick={() => setShowModal(true)}
      >
        New Post
      </button>
      {showModal && <PostModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default AddPostButton;
