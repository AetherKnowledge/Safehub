import LogsTable from "@/app/pages/Appointment/LogsTable";

const loading = () => {
  return <LogsTable logs={[]} totalCount={0} isLoading={true} />;
};

export default loading;
