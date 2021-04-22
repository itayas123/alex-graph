import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { ChartData, ChartOptions, ChartType } from "chart.js";
import GoogleSheetsService from "../services/GoogleSheets.service";
import { SheetsTitles } from "./Table";
import Loader from "./Loader/Loader";

export interface ChartProps {
  googleSheetsService: GoogleSheetsService;
  type?: ChartType;
}

const EXIT_DATE = "Exit Date";

const TotalChart: React.SFC<ChartProps> = ({
  type = "line",
  googleSheetsService,
}: ChartProps) => {
  const [isLoading, setIsLoading] = useState(true);
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
      );
      console.log(dates);

      const profits: number[] = [];
      dates.forEach((date, index) => {
        profits[index] = rows
          .filter((row) => row[EXIT_DATE] === date)
          .reduce((a, b) => {
            const PnL = b["$ PnL"];
            return a + parseFloat(PnL.replace(/,/g, ""));
          }, 0);
      });

      const chartData: ChartData = {
        labels: [startDate, ...dates.map((date) => date)],
        datasets: [
          {
            label: "Portfolio PNL$",
            data: [0, ...profits],
            type,
            fill: true,
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgba(255, 99, 132, 0.2)",
          },
        ],
      };
      console.log(chartData);
      setData(chartData);
    };

    initData();
  }, []);

  return (
    <div className="chart-div">
      {data ? <Line data={data} type={type} /> : <Loader />}
    </div>
  );
};

export default TotalChart;
