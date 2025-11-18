import LoadingPopup from "@/app/components/Popup/LoadingPopup";
import { UserType } from "@/app/generated/prisma";
import LogsTable from "@/app/pages/Appointment/LogsTable";
import { getLogs } from "@/app/pages/Appointment/LogsTable/LogActions";
import { Order } from "@/app/pages/Dashboard/Student/Dashboard";
import { auth } from "@/auth";
import { Suspense } from "react";
import { Await } from "react-router-dom";

export enum AppointmentLogSortBy {
  AppointmentDate = "startTime",
}

type Props = {
  searchParams: Promise<{
    perPage?: string;
    page?: string;
    sortBy?: AppointmentLogSortBy;
    order?: Order;
  }>;
};

const page = async ({ searchParams }: Props) => {
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

  console.log("Fetching logs with perPage:", perPage, "and page:", page);

  return (
    <Suspense fallback={<LoadingPopup message="Logs loading..." />}>
      <Await resolve={await getLogs({ perPage, page, sortBy, order })}>
        {(logsResult) => {
          if (!logsResult.success) {
            throw new Error(logsResult.message || "Failed to load logs.");
          }
          return (
            <LogsTable
              logs={logsResult.data?.logs || []}
              totalCount={logsResult.data?.totalCount || 0}
            />
          );
        }}
      </Await>
    </Suspense>
  );
};

export default page;
