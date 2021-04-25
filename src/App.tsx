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

  return (
    <div className="App">
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <div className="total-div">
            <Table
              title="Strategy Performance"
              googleSheetsService={googleSheetsService}
              sheetName={SheetsTitles.TOTAL}
              isHorizontal
            />
            <TotalChart googleSheetsService={googleSheetsService} />
          </div>
          <div>
            <Table
              title="Open Positions"
              googleSheetsService={googleSheetsService}
              sheetName={SheetsTitles.OPEN}
              offset={3}
            />
            <br />
            <Table
              title="Close Positions"
              googleSheetsService={googleSheetsService}
              sheetName={SheetsTitles.CLOSE}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
