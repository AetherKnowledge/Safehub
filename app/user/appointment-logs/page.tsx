import { UserType } from "@/app/generated/prisma";
import LogsTable from "@/app/pages/Appointment/LogsTable";
import { getLogs } from "@/app/pages/Appointment/LogsTable/LogActions";
import { AppointmentLogSortBy } from "@/app/pages/Appointment/LogsTable/sort";
import { Order } from "@/app/pages/Dashboard/Student/Dashboard";
import { auth } from "@/auth";

type Props = {
  searchParams: Promise<{
    perPage?: string;
    page?: string;
    sortBy?: AppointmentLogSortBy;
    order?: Order;
  }>;
};

const AppointmentLogsPage = async ({ searchParams }: Props) => {
  const session = await auth();
  if (!session?.user || session.user.type !== UserType.Admin) {
    throw new Error("Unauthorized");
  }

  const awaitedSearchParams = await searchParams;

  const sortBy =
    awaitedSearchParams.sortBy || AppointmentLogSortBy.AppointmentDate;
  const order = awaitedSearchParams.order || Order.Desc;

  const result = await getLogs({ sortBy, order });
  if (!result.success) {
    throw new Error("Failed to fetch logs");
  }

  return <LogsTable logs={result.data || []} />;
};

export default AppointmentLogsPage;
