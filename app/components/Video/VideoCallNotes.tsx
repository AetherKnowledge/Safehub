"use client";

import { Appointment } from "@/app/generated/prisma/browser";
import { updateNotes } from "@/app/pages/Appointment/AppointmentActions";
import { useEffect, useRef, useState } from "react";
import { FaRegCheckCircle, FaTimes } from "react-icons/fa";

interface VideoCallNotesProps {
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
}

const VideoCallNotes = ({
  appointment,
  isOpen,
  onClose,
}: VideoCallNotesProps) => {
  const [notes, setNotes] = useState(appointment.notes || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const lastSavedNotes = useRef(appointment.notes || "");

  async function handleSubmit() {
    if (notes === lastSavedNotes.current) return;

    setSaving(true);
    await updateNotes({ appointmentId: appointment.id, notes });
    lastSavedNotes.current = notes;
    setSaving(false);
    setSaved(true);
  }

  // Auto-save every 15 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (notes !== lastSavedNotes.current && !saving) {
        handleSubmit();
      }
    }, 5000);

    return () => clearInterval(autoSaveInterval);
  }, [notes, saving]);

  // Update saved state based on whether notes match last saved
  useEffect(() => {
    if (notes === lastSavedNotes.current && notes !== "") {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [notes]);

  if (!isOpen) return null;

  return (
    <div className="h-full bg-base-100 border-l border-base-300 flex flex-col w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/5 p-4 flex items-center justify-between border-b border-base-300">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-primary">Notes</h3>
          <p className="text-xs text-base-content/60 mt-2">
            Students cannot see counselor notes.
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-base-200 transition-colors duration-200"
        >
          <FaTimes className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <textarea
          placeholder="Enter session notes here..."
          className={`h-full flex-1 textarea textarea-md outline-none ring-0 focus:outline-none focus:ring-0 rounded text-base-content w-full bg-neutral`}
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
          }}
        />
      </div>

      {/* Footer */}
      <div className="bg-base-200 border-t border-base-300 p-4">
        <button
          className={`btn btn-sm w-full gap-2 transition-all ${
            saved ? "btn-success" : "btn-primary"
          }`}
          onClick={handleSubmit}
          disabled={saving || saved}
        >
          {saving ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Saving...
            </>
          ) : saved ? (
            <>
              <FaRegCheckCircle className="w-3 h-3 animate-bounce" />
              Saved!
            </>
          ) : (
            <>
              <FaRegCheckCircle className="w-3 h-3" />
              Save Notes
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default VideoCallNotes;
