"use client";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import Divider from "../../components/Divider";
import ComboBox from "../../components/Input/ComboBox";
import InputBox from "../../components/Input/InputBox";
import { usePopup } from "../../components/Popup/PopupProvider";
import UserImage from "../../components/UserImage";
import { changeUserInfo, SettingsUser } from "./SettingsActions";

enum Department {
  CITE = "CITE",
  CBA = "CBA",
}

enum Program {
  BSIT = "BSIT",
  BSCS = "BSCS",
  BSCpE = "BSCpE",
  BSBA = "BSBA",
  BSA = "BSA",
  BSF = "BSF",
}

enum Year {
  First = "1st Year",
  Second = "2nd Year",
  Third = "3rd Year",
  Fourth = "4th Year",
}

enum Section {
  A = "A",
  B = "B",
}

const Settings = ({ user }: { user: SettingsUser }) => {
  const popup = usePopup();

  async function handleSubmit(event: React.FormEvent) {
    popup.showLoading("Saving changes...");
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    await changeUserInfo(formData)
      .then(() => {
        popup.showSuccess("Changes saved successfully!");
      })
      .catch((error) => {
        popup.showError(error.message || "Failed to save changes");
      });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col max-w-2xl gap-3 bg-base-100 shadow-br rounded-xl"
    >
      <div className="flex flex-col p-4 gap-2">
        <div className="flex flex-row items-center">
          <UserImage
            name={user.name || user.email.split("@")[0] || "User"}
            width={16}
            src={user.image || undefined}
            bordered={true}
          />
          <div className="flex flex-col ml-4 w-full">
            <span className="font-bold">{user.name}</span>
            <span className="text-sm text-base-content/50">{user.email}</span>
          </div>
        </div>

        <div className="flex flex-row gap-5 w-full">
          <InputBox
            defaultValue={user.firstName || user.name?.split(" ")[0] || ""}
            name="firstName"
            legend="First Name"
            placeholder="First Name"
          />
          <InputBox
            defaultValue={user.lastName || user.name?.split(" ")[1] || ""}
            name="lastName"
            legend="Last Name"
            placeholder="Last Name"
          />
        </div>
        <div className="flex flex-row gap-5 w-full">
          <ComboBox
            name="department"
            legend="Department"
            defaultValue={"CITE"}
            placeholder="Select Department"
            options={Object.values(Department).map((value) => ({
              label: value,
              value,
            }))}
          />
          <ComboBox
            name="program"
            legend="Program"
            defaultValue={"BSIT"}
            placeholder="Select Program"
            options={Object.values(Program).map((value) => ({
              label: value,
              value,
            }))}
          />
          <ComboBox
            name="year"
            legend="Year"
            defaultValue={"First"}
            placeholder="Select Year"
            options={Object.values(Year).map((value, index) => ({
              label: value,
              value: (index + 1).toString(),
            }))}
          />
          <ComboBox
            name="section"
            legend="Section"
            defaultValue={"A"}
            placeholder="Select Section"
            options={Object.values(Section).map((value) => ({
              label: value,
              value,
            }))}
          />
        </div>
      </div>
      <Divider />
      <div className="flex flex-col p-4 gap-2">
        <div className="flex flex-col">
          <span className="font-bold text-xs">Account Recovery</span>
          <span className="text-xs text-base-content/50">
            Set your recovery email and phone number
          </span>
        </div>
        <div className="flex flex-row gap-5 w-full">
          <InputBox
            defaultValue={user.recoveryEmail || ""}
            name="recoveryEmail"
            legend="Recovery Email"
            placeholder="Recovery Email"
          />
          <InputBox
            defaultValue={user.phoneNumber || ""}
            name="phoneNumber"
            legend="Phone Number"
            placeholder="Phone Number"
          />
        </div>
      </div>
      <div className="flex flex-row items-center justify-between p-4 pt-0">
        <Link
          type="button"
          className="btn btn-primary text-white p-2 w-40 text-sm"
          href="/api/auth/signout"
        >
          <IoLogOut className="text-lg mr-2" />
          Log Out
        </Link>
        <button
          type="submit"
          className="btn btn-primary text-white p-2 w-40 text-sm"
        >
          <FaEdit className="text-lg mr-2" />
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default Settings;
