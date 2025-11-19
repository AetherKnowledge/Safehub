import { UserType } from "@/app/generated/prisma";
import LogsTable from "@/app/pages/Appointment/LogsTable";
import { getLogs } from "@/app/pages/Appointment/LogsTable/LogActions";
import { AppointmentLogSortBy } from "@/app/pages/Appointment/LogsTable/sort";
import { Order } from "@/app/pages/Dashboard/Student/Dashboard";
import { auth } from "@/auth";
import { Suspense } from "react";
import { Await } from "react-router-dom";

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

  const perPageNum = parseInt(awaitedSearchParams.perPage || "5");
  const pageNum = parseInt(awaitedSearchParams.page || "1");
  const sortBy =
    awaitedSearchParams.sortBy || AppointmentLogSortBy.AppointmentDate;
  const order = awaitedSearchParams.order || Order.Desc;

  const perPage = !Number.isNaN(perPageNum) && perPageNum > 0 ? perPageNum : 5;
  const page = !Number.isNaN(pageNum) && pageNum > 0 ? pageNum : 1;

  return (
    <Suspense
      fallback={<LogsTable logs={[]} totalCount={0} isLoading={true} />}
    >
      <Await resolve={getLogs({ perPage, page, sortBy, order })}>
        {(logsData) => {
          if (!logsData.success) {
            throw new Error(logsData.message || "Failed to load logs.");
          }

          return (
            <LogsTable
              logs={logsData.data?.logs || []}
              totalCount={logsData.data?.totalCount || 0}
            />
          );
        }}
      </Await>
    </Suspense>
  );
};

export default AppointmentLogsPage;
