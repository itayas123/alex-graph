import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { ChartData, ChartType, ChartOptions, Tick } from "chart.js";
import GoogleSheetsService from "../services/GoogleSheets.service";
import { SheetsTitles } from "./Table";

export interface ChartProps {
  googleSheetsService: GoogleSheetsService;
  isLoading: boolean;
  setIsLoading: () => any;
  type?: ChartType;
}

const EXIT_DATE = "Exit Date";

const getValueAsCurrency = (value: any, minimumFractionDigits: number = 2) =>
  new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits,
  }).format(value);

const options: ChartOptions = {
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context: any) {
          let label = context.dataset.label || "";

          if (label) {
            label += ": ";
          }
          if (context.parsed.y !== null) {
            label += getValueAsCurrency(context.parsed.y);
          }
          return label;
        },
      },
    },
  },
  scales: {
    yAxes: {
      ticks: {
        // Include a dollar sign in the ticks
        callback: (ticketValue) => getValueAsCurrency(ticketValue, 0),
      },
    },
  },
};

const TotalChart: React.SFC<ChartProps> = ({
  googleSheetsService,
  isLoading,
  setIsLoading,
  type = "line",
}: ChartProps) => {
  const [data, setData] = useState<ChartData>();
  useEffect(() => {
    const initData = async () => {
      const rows = await googleSheetsService.getRowsByTitle(SheetsTitles.CLOSE);
      const startDateColumn = (
        await googleSheetsService.getCellsByTitle(SheetsTitles.OPEN)
      )[0];
      const startDateArray = startDateColumn.Header.split(" ");
      const startDate = startDateArray[startDateArray.length - 1];

      const dates: Date[] = Array.from(
        new Set(rows.map((row) => row[EXIT_DATE]))
      ).sort((a, b) => new Date(a).getDate() - new Date(b).getDate());

      const profits: number[] = [];
      dates.forEach((date, index) => {
        profits[index] = rows
          .filter((row) => {
            return new Date(row[EXIT_DATE]) <= new Date(date);
          })
          .reduce((a, b) => {
            const PnL = b["$ PnL"];
            return a + parseFloat(PnL.replace(/,/g, ""));
          }, 0);
      });

      const chartData: ChartData = {
        labels: [startDate, ...dates],
        datasets: [
          {
            label: "Portfolio Performance",
            data: [0, ...profits],
            fill: false,
            backgroundColor: "rgb(55, 179, 115)",
            borderColor: "rgba(55, 179, 115, 0.2)",
          },
        ],
      };
      setData(chartData);
      setIsLoading();
    };

    initData();
  }, [googleSheetsService]);

  return (
    <div className="chart-div">
      {isLoading ? <></> : <Line data={data} options={options} type={type} />}
    </div>
  );
};

export default TotalChart;
