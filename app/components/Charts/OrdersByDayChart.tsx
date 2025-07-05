"use client";
import React from "react";
import {
  AreaChart,
  TooltipProps,
} from "@/tremor/src/components/AreaChart/AreaChart";

const data = [
  { date: "2023-10-01", test: 1000 },
  { date: "2023-10-02", test: 1200 },
  { date: "2023-10-03", test: 800 },
  { date: "2023-10-04", test: 1500 },
  { date: "2023-10-05", test: 900 },
  { date: "2023-10-06", test: 1100 },
  { date: "2023-10-07", test: 1300 },
  { date: "2023-10-08", test: 1400 },
  { date: "2023-10-09", test: 1600 },
  { date: "2023-10-10", test: 1700 },
];

const OrdersByDayChart = () => {
  const [datas, setDatas] = React.useState<TooltipProps | null>(null);
  const tooltipStateRef = React.useRef<TooltipProps | null>(null);

  React.useEffect(() => {
    const state = tooltipStateRef.current;
    if (
      state &&
      (!datas || state.label !== datas.label || state.active !== datas.active)
    ) {
      setDatas(state.active ? state : null);
    }
  }, [tooltipStateRef.current]);

  const currencyFormatter = (number: number) =>
    `$${Intl.NumberFormat("us").format(number)}`;

  const payload = datas?.payload?.[0];
  const value = payload ? payload.value : 0;

  const formattedValue = payload
    ? currencyFormatter(value)
    : currencyFormatter(data[data.length - 1].test);
  return (
    <div className="dark:bg-base-content bg-white p-6 rounded-lg shadow-br border border-base-content">
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Revenue by month
      </p>
      <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-gray-50">
        {formattedValue}
      </p>

      <AreaChart
        data={data}
        index="date"
        categories={["test"]}
        showLegend={false}
        showYAxis={false}
        startEndOnly={true}
        className="-mb-2 mt-8 h-48"
        tooltipCallback={(props) => {
          tooltipStateRef.current = props; // Just update the ref
          return null;
        }}
      />
    </div>
  );
};

export default OrdersByDayChart;
