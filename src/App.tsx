import React, { useEffect, useState } from "react";
import "./App.css";
import Table, { SheetsTitles } from "./components/Table";
import GoogleSheetsService from "./services/GoogleSheets.service";
import Loader from "./components/Loader/Loader";

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
        <>
          <Table
            googleSheetsService={googleSheetsService}
            title={SheetsTitles.TOTAL}
            isHorizontal
          />
          <Table
            googleSheetsService={googleSheetsService}
            title={SheetsTitles.CLOSE}
          />
          <Table
            googleSheetsService={googleSheetsService}
            title={SheetsTitles.OPEN}
            offset={3}
          />
        </>
      )}
    </div>
  );
}

export default App;
