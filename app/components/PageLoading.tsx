const HotlinePageLoading = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-full h-full bg-base-100 rounded shadow-br">
      <div className="loading loading-spinner loading-lg text-primary"></div>
      <p className="text-base-content">{text}</p>
    </div>
  );
};

export default HotlinePageLoading;
