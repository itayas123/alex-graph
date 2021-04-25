import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { ChartData, ChartType } from "chart.js";
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
          .filter((row) => {
            return new Date(row[EXIT_DATE]) <= new Date(date);
          })
          .reduce((a, b) => {
            const PnL = b["$ PnL"];
            console.log(a, date, b[EXIT_DATE], b["$ PnL"]);

            return a + parseFloat(PnL.replace(/,/g, ""));
          }, 0);
      });

      const chartData: ChartData = {
        labels: [startDate, ...dates],
        datasets: [
          {
            label: "Portfolio Perfomance",
            data: [0, ...profits],
            fill: false,
            backgroundColor: "rgb(55, 179, 115)",
            borderColor: "rgba(55, 179, 115, 0.2)",
          },
        ],
      };
      console.log(chartData);
      setData(chartData);
    };

    initData();
  }, [googleSheetsService]);

  return (
    <div className="chart-div">
      {data ? <Line data={data} type={type} /> : <Loader />}
    </div>
  );
};

export default TotalChart;
