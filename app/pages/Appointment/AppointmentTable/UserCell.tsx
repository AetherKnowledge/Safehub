"use client";

import UserImage from "@/app/components/UserImage";
import { UserType } from "@/app/generated/prisma";
import { useState } from "react";
import { AppointmentData } from "../AppointmentActions";
import UserDetailsPopup, { StudentDetails } from "../Modals/UserDetailsPopup";

const UserCell = ({
  userType,
  appointment,
}: {
  userType: UserType;
  appointment: AppointmentData;
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <UserImage
        name={
          userType === UserType.Student
            ? appointment.counselor.user.name ??
              appointment.counselor.user.email.split("@")[0] ??
              "Counselor"
            : appointment.student.user.name ??
              appointment.student.user.email.split("@")[0] ??
              "Student"
        }
        width={10}
        src={
          userType === UserType.Student
            ? appointment.counselor.user.image || undefined
            : appointment.student.user.image || undefined
        }
        onClick={
          userType === UserType.Counselor ? () => setShowModal(true) : undefined
        }
      />
      <p className="font-semibold text-sm">
        {userType === UserType.Student
          ? appointment.counselor.user.name ??
            appointment.counselor.user.email.split("@")[0] ??
            "Counselor"
          : appointment.student.user.name ??
            appointment.student.user.email.split("@")[0] ??
            "Student"}
      </p>
      {showModal && (
        <UserDetailsPopup
          user={
            userType === UserType.Counselor
              ? appointment.student.user
              : appointment.counselor.user
          }
          onClose={() => setShowModal(false)}
        >
          {userType === UserType.Counselor && (
            <StudentDetails user={appointment.student.user} />
          )}
        </UserDetailsPopup>
      )}
    </>
  );
};

export default UserCell;
