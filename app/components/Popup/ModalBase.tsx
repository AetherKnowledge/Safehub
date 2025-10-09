const ModalBase = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-brightness-50 z-50">
      {children}
    </div>
  );
};

export default ModalBase;
