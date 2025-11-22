"use client";

import { useState } from "react";
import ModalBase from "../Popup/ModalBase";
import MoodTrackerBox from "./MoodTrackerBox";

const MoodTrackerPopup = () => {
  const [showModal, setShowModal] = useState(true);

  async function handleClose() {
    setShowModal(false);
  }

  return (
    showModal && (
      <ModalBase onClose={handleClose}>
        <MoodTrackerBox className="w-150" onClose={handleClose} canSkip />
      </ModalBase>
    )
  );
};
export default MoodTrackerPopup;
