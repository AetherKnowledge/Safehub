import LogsTable from "@/app/pages/Appointment/LogsTable";

const loading = () => {
  return <LogsTable logs={[]} isLoading={true} />;
};

export default loading;
