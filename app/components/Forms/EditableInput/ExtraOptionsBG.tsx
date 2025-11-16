const ExtraOptionsBG = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col w-full items-end py-2">
      <div className="flex flex-col gap-2 items-end">{children}</div>
    </div>
  );
};

export default ExtraOptionsBG;
