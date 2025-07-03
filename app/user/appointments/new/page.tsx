"use client";
import React, { useEffect } from "react";
import { MdOutlineArrowBackIos } from "react-icons/md";
import Link from "next/link";
import { motion } from "framer-motion";
import DatePicker from "@/app/components/Date/DatePicker";
import TimePicker from "@/app/components/Date/TimePicker";
import { useState } from "react";

const BookAppointment = () => {
  return (
    <div className="flex flex-col h-[82vh] ">
      <div className="flex items-center justify-between p-4 border-b-1 border-none rounded-t-2xl text-base-content bg-base-100">
        <h2 className="text-3xl font-bold text-primary">Book Appointments</h2>
        <motion.div
          initial={{ opacity: 0.7 }}
          whileHover={{ scale: 1.08, opacity: 1 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
        >
          <Link href="/user/appointments">
            <MdOutlineArrowBackIos className="text-3xl text-base-content cursor-pointer" />
          </Link>
        </motion.div>
      </div>
      <div className="divider mt-[-8] pl-3 pr-3" />

      <DateTimePicker
        onChange={(date) => {
          console.log("Selected Date and Time:", date);
        }}
      />
      <div className="flex items-center justify-between p-8 text-base-content">
        <button className="btn btn-outline w-30 text-md">Back</button>
        <button className="btn btn-outline w-30 text-md">Next</button>
      </div>
    </div>
  );
};

interface DatePickerProps {
  onChange?: (value: Date) => void;
}

const DateTimePicker = ({ onChange }: DatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  useEffect(() => {
    if (selectedDate && selectedTime) {
      const [year, month, day] = selectedDate.split("-").map(Number);
      const [hours, minutes] = selectedTime.split(":").map(Number);

      const dateTime = new Date(
        new Date(year, month - 1, day, hours, minutes, 0)
      );
      onChange?.(dateTime);
    }
  }, [selectedDate, selectedTime, onChange]);

  return (
    <div className="flex flex-col gap-10 pr-5 pl-5 h-full">
      <div className="text-base-content text-2xl font-semibold">
        Pick a Preferred Date & Time
      </div>
      <div>
        <div className="flex flex-col lg:flex-row items-center justify-center h-full gap-15">
          <DatePicker onChange={setSelectedDate} />
          <TimePicker onChange={setSelectedTime} />
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
