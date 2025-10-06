const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-base-100 p-6 rounded-lg shadow-lg text-center">
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-base-content">Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
