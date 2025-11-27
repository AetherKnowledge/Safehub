import TextArea from "@/app/components/Input/TextArea";
import ModalBase from "@/app/components/Popup/ModalBase";
import { useState } from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { LuClipboardList } from "react-icons/lu";
import { AppointmentData, updateNotes } from "../AppointmentActions";
import CloseButton from "./CloseButton";

const NotesButton = ({ appointment }: { appointment: AppointmentData }) => {
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState(appointment.notes || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit() {
    setSaving(true);
    await updateNotes({ appointmentId: appointment.id, notes });
    setSaving(false);
    setSaved(true);

    // Reset to "Save Notes" after 2 seconds
    setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  return (
    <>
      <button
        className="flex flex-row btn gap-1 justify-center items-center btn-sm bg-gray-100 text-black hover:bg-gray-300 active:bg-gray-400 h-8"
        onClick={() => setShowModal(true)}
      >
        <LuClipboardList className="w-4 h-4" />
        Notes
      </button>
      {showModal && (
        <ModalBase onClose={() => setShowModal(false)}>
          <div className="bg-base-100 p-0 rounded-2xl shadow-2xl text-base-content max-w-2xl w-full flex flex-col overflow-hidden">
            <CloseButton onClick={() => setShowModal(false)} />
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/5 p-6 pb-4">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-bold text-primary">Notes</h2>
                  <p className="text-sm text-base-content/70 text-wrap">
                    View or add notes for this appointment. Students cannot see
                    counselor notes.
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <TextArea
                  name="notes"
                  legend="Notes:"
                  placeholder="Enter session notes here..."
                  value={notes}
                  onChange={(note) => setNotes(note)}
                />
              </div>

              {/* Footer */}
              <div className="bg-base-200 border-t border-base-300 px-6 py-4">
                <div className="flex justify-end">
                  <button
                    className={`btn gap-2 transition-all ${
                      saved ? "btn-success" : "btn-primary"
                    }`}
                    onClick={handleSubmit}
                    disabled={saving || saved}
                  >
                    {saving ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Saving...
                      </>
                    ) : saved ? (
                      <>
                        <FaRegCheckCircle className="w-4 h-4 animate-bounce" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <FaRegCheckCircle className="w-4 h-4" />
                        Save Notes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ModalBase>
      )}
    </>
  );
};

export default NotesButton;
