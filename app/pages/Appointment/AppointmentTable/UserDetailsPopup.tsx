"use client";

import Divider from "@/app/components/Divider";
import { FormComponentType } from "@/app/components/Forms/FormBuilder";
import HorizontalItemsBox from "@/app/components/Input/HorizontalItemsBox";
import LinkedSelector from "@/app/components/Input/LinkedSelector";
import { SelectBoxProps } from "@/app/components/Input/SelectBox";
import ModalBase from "@/app/components/Popup/ModalBase";
import { User } from "@/app/generated/prisma";
import {
  departmentsWithPrograms,
  genderOptions,
  sectionOptions,
  yearOptions,
} from "../../Onboarding/Questions";
import { GuardianDetails } from "../../Settings/Settings";
import { StudentDetailsData } from "../AppointmentActions";
import CloseButton from "./CloseButton";
import UserTopBar from "./UserTopBar";

const UserDetailsPopup = ({
  user,
  onClose,
  chatId,
  children,
}: {
  user: Pick<User, "name" | "email" | "image">;
  onClose?: () => void;
  chatId?: string;
  children?: React.ReactNode;
}) => {
  return (
    <ModalBase onClose={onClose}>
      <div className="bg-base-100 p-0 rounded-lg shadow-lg text-base-content max-w-2xl flex-1 flex flex-col">
        <CloseButton onClick={() => onClose && onClose()} />
        <div className="p-6 pt-0">
          <div className="flex flex-col gap-3">
            <UserTopBar
              userName={user.name || user.email.split("@")[0] || "User"}
              userEmail={user.email}
              userImgSrc={user.image || undefined}
              chatId={chatId}
            />
            {children}
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

export default UserDetailsPopup;
