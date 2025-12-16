"use client";
import Divider from "@/app/components/Divider";
import { FormComponentType } from "@/app/components/Forms/FormBuilder.types";
import HorizontalItemsBox from "@/app/components/Input/HorizontalItemsBox";
import LinkedSelector from "@/app/components/Input/LinkedSelector";
import { SelectBoxProps } from "@/app/components/Input/SelectBox";
import { TextBoxProps } from "@/app/components/Input/TextBox";
import { UserType } from "@/app/generated/prisma/browser";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { usePopup } from "../../components/Popup/PopupProvider";
import UserImage from "../../components/UserImage";
import { StudentDetailsData } from "../Appointment/AppointmentActions";
import {
  departmentsWithPrograms,
  genderOptions,
  sectionOptions,
  yearOptions,
} from "../Onboarding/Questions";
import { changeUserInfo, SettingsUser } from "./SettingsActions";

const Settings = ({ user }: { user: SettingsUser }) => {
  const session = useSession();
  const popup = usePopup();
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    popup.showLoading("Saving changes...");
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    const result = await changeUserInfo(formData);

    if (!result.success) {
      popup.showError(result.message || "Failed to save changes");
      return;
    }

    popup.showSuccess("Changes saved successfully!");
    await session.update();
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full h-full gap-0 bg-linear-to-br from-base-100 to-base-200/50 shadow-xl rounded-xl overflow-y-auto"
    >
      {/* Profile Header */}
      <div className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-base-content/5">
        <div className="flex flex-row items-center gap-4">
          <div className="relative">
            <UserImage
              name={user.name || user.email.split("@")[0] || "User"}
              width={20}
              src={user.image || undefined}
              bordered
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-4 border-base-100"></div>
          </div>
          <div className="flex flex-col flex-1">
            <span className="font-bold text-xl">{user.name}</span>
            <span className="text-sm text-base-content/60">{user.email}</span>
            <span className="text-xs text-primary font-medium mt-1 uppercase tracking-wide">
              {session.data?.user.type}
            </span>
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="flex flex-col p-6 gap-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-6 bg-primary rounded-full"></div>
          <h3 className="font-bold text-lg">Personal Information</h3>
        </div>

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
        />
        {session.data?.user.type === UserType.Student && (
          <>
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
            />
          </>
        )}
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
        />

        {session.data?.user.type === UserType.Student && (
          <>
            <Divider />

            {/* Guardian Information Section */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-6 bg-primary rounded-full"></div>
              <div className="flex flex-col">
                <h3 className="font-bold text-lg">Guardian Information</h3>
                <span className="text-xs text-base-content/60">
                  {"Set your guardian's contact details for emergencies"}
                </span>
              </div>
            </div>

            <GuardianDetails user={user} />
          </>
        )}

        <Divider />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row items-center justify-between gap-4 p-6 pt-0 bg-gradient-to-t from-base-200/30 to-transparent">
        <Link
          type="button"
          className="btn btn-outline btn-error hover:btn-error gap-2 flex-1 shadow-md hover:shadow-lg transition-all max-w-50"
          href="/api/auth/signout"
        >
          <IoLogOut className="text-lg" />
          Log Out
        </Link>
        <button
          type="submit"
          className="btn btn-primary gap-2 flex-1 shadow-md hover:shadow-lg transition-all max-w-50"
        >
          <FaEdit className="text-lg" />
          Save Changes
        </button>
      </div>
    </form>
  );
};

export function GuardianDetails({
  user,
  readOnly = false,
}: {
  user: SettingsUser | StudentDetailsData;
  readOnly?: boolean;
}) {
  return (
    <>
      <HorizontalItemsBox
        name="guardian-full-name"
        items={[
          {
            type: FormComponentType.TEXT,
            props: {
              name: "guardianFirstName",
              legend: "First Name",
              placeholder: "First Name",
              defaultValue: user.guardianFirstName || "",
            },
          },
          {
            type: FormComponentType.TEXT,
            props: {
              name: "guardianMiddleName",
              legend: "Middle Name",
              placeholder: "Middle Name",
              defaultValue: user.guardianMiddleName || "",
            },
          },
          {
            type: FormComponentType.TEXT,
            props: {
              name: "guardianLastName",
              legend: "Last Name",
              placeholder: "Last Name",
              defaultValue: user.guardianLastName || "",
            },
          },
          {
            type: FormComponentType.TEXT,
            props: {
              name: "guardianSuffix",
              legend: "Suffix",
              placeholder: "Suffix",
              defaultValue: user.guardianSuffix || "",
            },
          },
        ]}
        readonly={readOnly}
      />
      <HorizontalItemsBox
        name="guardian-contact-and-email"
        items={[
          {
            type: FormComponentType.TEXT,
            props: {
              name: "guardianContact",
              legend: "Guardian Contact Number",
              placeholder: "Contact Number",
              type: "tel",
              defaultValue: user.guardianContact,
            } as TextBoxProps,
          },
          {
            type: FormComponentType.TEXT,
            props: {
              name: "guardianEmail",
              legend: "Guardian Email",
              placeholder: "Email",
              type: "email",
              defaultValue: user.guardianEmail || "",
            } as TextBoxProps,
          },
        ]}
        readonly={readOnly}
      />
    </>
  );
}

export default Settings;
