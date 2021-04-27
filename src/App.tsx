import React, { useEffect, useState } from "react";
import "./App.css";
import Table, { SheetsTitles } from "./components/Table";
import GoogleSheetsService from "./services/GoogleSheets.service";
import Loader from "./components/Loader/Loader";
import TotalChart from "./components/TotalChart";

const googleSheetsService: GoogleSheetsService = new GoogleSheetsService();

function App() {
  const [loadingCount, setLoadingCount] = useState(0);
  const isLoading = loadingCount < 5;

  useEffect(() => {
    const initSheets = async () => {
      try {
        await googleSheetsService.init();
      } catch (err) {
        console.error(err);
      }
      setLoadingCount((count) => count + 1);
    };

    initSheets();
  }, []);

  return (
    <div className="App">
      {isLoading && <Loader />}
      {loadingCount > 0 ? (
        <div>
          <div className="total-div">
            <Table
              title="Strategy Performance"
              isLoading={isLoading}
              setIsLoading={() => setLoadingCount((count) => count + 1)}
              googleSheetsService={googleSheetsService}
              sheetName={SheetsTitles.TOTAL}
              isHorizontal
            />
            <TotalChart
              googleSheetsService={googleSheetsService}
              isLoading={loadingCount < 4}
              setIsLoading={() => setLoadingCount((count) => count + 1)}
            />
          </div>
          <div>
            <Table
              title="Open Positions"
              isLoading={isLoading}
              setIsLoading={() => setLoadingCount((count) => count + 1)}
              googleSheetsService={googleSheetsService}
              sheetName={SheetsTitles.OPEN}
              offset={3}
            />
            <br />
            <Table
              title="Close Positions"
              isLoading={isLoading}
              setIsLoading={() => setLoadingCount((count) => count + 1)}
              googleSheetsService={googleSheetsService}
              sheetName={SheetsTitles.CLOSE}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;
