"use client";

import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { MdMessage } from "react-icons/md";
import ModalBase from "../../Popup/ModalBase";
import { AppointmentData } from "./AppointmentsActions";

const Feedback = ({ appointment }: { appointment: AppointmentData }) => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [anonymous, setAnonymous] = useState<boolean>(true);

  const handleSubmit = async () => {
    // Placeholder: wire this up to your API or actions
    console.log("Submitting feedback", {
      rating,
      feedback,
      anonymous,
      appointment,
    });
    // Close modal after submit
    setShowFeedbackModal(false);
  };

  return (
    <>
      <button
        className="flex flex-row btn bg-blue-500 hover:bg-blue-600 active:bg-blue-800 text-white gap-1 justify-center items-center btn-sm h-8"
        onClick={() => setShowFeedbackModal(true)}
      >
        <MdMessage className="w-3 h-3" />
        Feedback
      </button>

      {showFeedbackModal && (
        <ModalBase>
          <div className="bg-base-100 p-6 rounded-lg shadow-lg text-center max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold mb-4">
              Rate your experience
            </h2>

            {/* Stars */}
            <div className="flex justify-center gap-6 mb-6" aria-hidden>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-5xl leading-none outline-none focus:outline-none text-primary cursor-pointer transition-transform duration-150 hover:scale-110`}
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                >
                  {rating >= star ? <FaStar /> : <FaRegStar />}
                </button>
              ))}
            </div>

            <p className="text-base my-2">
              Tell us more about your experience and any other suggestions.
            </p>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Add your feedback"
              className="textarea w-full h-28 p-3 border border-gray-300 rounded mb-4 resize-none outline-none ring-0 focus:ring-1 focus:outline-0"
            />

            <div className="flex items-center justify-between gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="toggle toggle-sm toggle-primary"
                />
                <span className="ml-2">Anonymous</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  className="btn btn-ghost"
                  onClick={() => setShowFeedbackModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary text-white"
                  onClick={() => handleSubmit()}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </ModalBase>
      )}
    </>
  );
};

export default Feedback;
