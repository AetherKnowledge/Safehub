type ErrorScreenProps = {
  message: string;
  onClose?: () => void;
};

const ErrorScreen = ({ message, onClose }: ErrorScreenProps) => (
  <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm z-50">
    <div className="bg-base-100 p-6 rounded-lg shadow-lg text-center">
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <p className="text-error">Error: {message}</p>
        <button className="btn btn-primary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  </div>
);

export default ErrorScreen;
