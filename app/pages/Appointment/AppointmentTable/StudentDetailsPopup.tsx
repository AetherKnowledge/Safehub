"use client";

import Divider from "@/app/components/Divider";
import { FormComponentType } from "@/app/components/Forms/FormBuilder";
import HorizontalItemsBox from "@/app/components/Input/HorizontalItemsBox";
import LinkedSelector from "@/app/components/Input/LinkedSelector";
import { SelectBoxProps } from "@/app/components/Input/SelectBox";
import ModalBase from "@/app/components/Popup/ModalBase";
import UserImage from "@/app/components/UserImage";
import Link from "next/link";
import { AiOutlineMessage } from "react-icons/ai";
import { IoCallOutline } from "react-icons/io5";
import { useCallPopup } from "../../Chats/ChatBox/CallPopupProvider";
import {
  departmentsWithPrograms,
  genderOptions,
  sectionOptions,
  yearOptions,
} from "../../Onboarding/Questions";
import { GuardianDetails } from "../../Settings/Settings";
import { AppointmentData, StudentDetailsData } from "../AppointmentActions";
import CloseButton from "./CloseButton";

const StudentDetailsPopup = ({
  appointment,
  onClose,
}: {
  appointment: AppointmentData;
  onClose: () => void;
}) => {
  const { initiateCall } = useCallPopup();

  const handleInitiateCall = () => {
    if (!appointment.chatId) return;

    initiateCall(appointment.chatId);
  };

  return (
    <ModalBase onClose={onClose}>
      <div className="bg-base-100 p-0 rounded-lg shadow-lg text-base-content max-w-2xl flex-1 flex flex-col">
        <CloseButton onClick={onClose} />
        <div className="p-6 pt-0">
          <div className="flex flex-col gap-3">
            <div className="flex flex-row gap-5 items-center">
              <UserImage
                src={appointment.student.user.image || undefined}
                name={appointment.student.user.name || "Unknown"}
                width={20}
                bordered
                borderWidth={3}
              />

              <div className="flex flex-col flex-1">
                <p className="text-xs font-semibold">Appointment with...</p>
                <p className="font-semibold">
                  {appointment.student.user.name || "Unknown"}
                </p>
                <p className="text-xs font-semibold text-base-content/70">
                  {appointment.student.user.email || "Unknown"}
                </p>
                <div className="flex flex-row gap-2 mt-2">
                  <Link
                    className="btn btn-primary rounded-full p-0 h-8 w-8"
                    href={`/user/chats/${appointment.chatId}`}
                  >
                    <AiOutlineMessage className="h-5 w-5" />
                  </Link>
                  <button
                    className="btn btn-primary rounded-full p-0 h-8 w-8"
                    onClick={handleInitiateCall}
                  >
                    <IoCallOutline className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            <StudentDetails user={appointment.student.user} />
          </div>
        </div>
      </div>
    </ModalBase>
  );
};

export function StudentDetails({ user }: { user: StudentDetailsData }) {
  return (
    <>
      <HorizontalItemsBox
        name="full-name"
        items={[
          {
            type: FormComponentType.TEXT,
            props: {
              name: "firstName",
              legend: "First Name",
              placeholder: "First Name",
              defaultValue: user.firstName || "",
            },
          },
          {
            type: FormComponentType.TEXT,
            props: {
              name: "middleName",
              legend: "Middle Name",
              placeholder: "Middle Name",
              defaultValue: user.middleName || "",
            },
          },
          {
            type: FormComponentType.TEXT,
            props: {
              name: "lastName",
              legend: "Last Name",
              placeholder: "Last Name",
              defaultValue: user.lastName || "",
            },
          },
          {
            type: FormComponentType.TEXT,
            props: {
              name: "suffix",
              legend: "Suffix",
              placeholder: "Suffix",
              defaultValue: user.suffix || "",
            },
          },
        ]}
        readonly
      />
      <LinkedSelector
        name="department-and-program"
        horizontal={true}
        parent={{
          type: FormComponentType.SELECT,
          props: {
            name: "department",
            legend: "Department",
            defaultValue: user.department,
          } as SelectBoxProps,
        }}
        child={{
          type: FormComponentType.SELECT,
          props: {
            name: "program",
            legend: "Program",
            defaultValue: user.program,
          } as SelectBoxProps,
        }}
        linkedOptions={departmentsWithPrograms}
        readonly
      />
      <HorizontalItemsBox
        name="year-and-section"
        items={[
          {
            type: FormComponentType.SELECT,
            props: {
              name: "year",
              legend: "Year",
              options: yearOptions,
              defaultValue: user.year?.toString(),
            } as SelectBoxProps,
          },
          {
            type: FormComponentType.SELECT,
            props: {
              name: "section",
              legend: "Section",
              options: sectionOptions,
              defaultValue: user.section,
            } as SelectBoxProps,
          },
        ]}
        readonly
      />
      <HorizontalItemsBox
        name="gender-and-contact"
        items={[
          {
            type: FormComponentType.SELECT,
            props: {
              name: "gender",
              legend: "Gender",
              options: genderOptions,
              defaultValue: user.gender,
            } as SelectBoxProps,
          },
          {
            type: FormComponentType.TEXT,
            props: {
              name: "contactNumber",
              legend: "Contact Number",
              placeholder: "Contact Number",
              type: "tel",
              defaultValue: user.phoneNumber || "",
            },
          },
        ]}
        readonly
      />

      <Divider />
      <div className="flex flex-col mt-2">
        <span className="font-bold text-xs">Guardian Information</span>
        <span className="text-xs text-base-content/50">
          {"Student's guardian information"}
        </span>
      </div>
      <GuardianDetails user={user} readOnly />
    </>
  );
}

export default StudentDetailsPopup;
