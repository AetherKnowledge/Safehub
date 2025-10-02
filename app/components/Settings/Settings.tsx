"use client";
import { imageGenerator } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import Divider from "../Divider";
import ErrorScreen from "../ErrorScreen";
import LoadingScreen from "../LoadingScreen";
import SuccessScreen from "../SuccessScreen";
import ComboBox from "./ComboBox";
import InputBox from "./InputBox";
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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [showErrorScreen, setShowErrorScreen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    setIsLoading(true);
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    try {
      const result = await changeUserInfo(formData);
      setShowSuccessScreen(true);
    } catch (error) {
      setErrorMessage((error as Error).message);
      setShowErrorScreen(true);
    }

    setIsLoading(false);
  }

  return (
    <>
      {isLoading && <LoadingScreen />}
      {showSuccessScreen && (
        <SuccessScreen onClose={() => setShowSuccessScreen(false)} />
      )}
      {showErrorScreen && (
        <ErrorScreen
          message={errorMessage}
          onClose={() => setShowErrorScreen(false)}
        />
      )}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col max-w-2xl gap-3 bg-base-100 shadow-br rounded-xl"
      >
        <div className="flex flex-col p-4 gap-2">
          <div className="flex flex-row items-center">
            <div className="border-4 border-primary bg-primary rounded-full">
              {imageGenerator(
                user.name || user.email,
                20,
                user.image || undefined
              )}
            </div>
            <div className="flex flex-col ml-4 w-full">
              <span className="font-bold">{user.name}</span>
              <span className="text-sm text-gray-500">{user.email}</span>
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
            <span className="text-xs text-gray-500">
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
          <button
            type="button"
            className="btn btn-primary text-white p-2 w-40 text-sm"
            onClick={() => router.push("/api/auth/signout")}
          >
            <IoLogOut className="text-lg mr-2" />
            Log Out
          </button>
          <button
            type="submit"
            className="btn btn-primary text-white p-2 w-40 text-sm"
          >
            <FaEdit className="text-lg mr-2" />
            Save Changes
          </button>
        </div>
      </form>
    </>
  );
};

export default Settings;
