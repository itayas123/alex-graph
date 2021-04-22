import React, { useEffect, useState } from "react";
import "./App.css";
import Table, { SheetsTitles } from "./components/Table";
import GoogleSheetsService from "./services/GoogleSheets.service";
import Loader from "./components/Loader/Loader";
import TotalChart from "./components/TotalChart";

const googleSheetsService: GoogleSheetsService = new GoogleSheetsService();

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initSheets = async () => {
      try {
        await googleSheetsService.init();
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    };

    initSheets();
  }, []);

  const lineType: Chart.ChartType = "line";

  return (
    <div className="App">
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <div className="total-div">
            <Table
              googleSheetsService={googleSheetsService}
              title={SheetsTitles.TOTAL}
              isHorizontal
            />
            <TotalChart googleSheetsService={googleSheetsService} />
          </div>
          <div>
            <Table
              googleSheetsService={googleSheetsService}
              title={SheetsTitles.CLOSE}
            />
            <br />
            <Table
              googleSheetsService={googleSheetsService}
              title={SheetsTitles.OPEN}
              offset={3}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
