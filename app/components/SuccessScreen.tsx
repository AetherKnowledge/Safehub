import { useEffect, useState } from "react";

type SuccessScreenProps = {
  onClose: () => void;
};

const SuccessScreen = ({ onClose }: SuccessScreenProps) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <p className="text-base-content text-2xl">Success</p>
          <p className="text-base-content text-sm">
            Closing in {countdown} seconds...
          </p>
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;
