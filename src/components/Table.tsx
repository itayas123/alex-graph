import { useEffect, useState } from "react";
import { Column } from "react-table-6";
import { GoogleSpreadsheetRow, PaginationOptions } from "google-spreadsheet";
import GoogleSheetsService from "../services/GoogleSheets.service";
import DataTable from "./DataTable/DataTable";
import Loader from "./Loader/Loader";

export enum SheetsTitles {
  TOTAL = "Таблица 1",
  OPEN = "Таблица 2",
  CLOSE = "Таблица 3",
}

export const SheetsColumns = {
  "Таблица 1": 2,
  "Таблица 2": 7,
  "Таблица 3": 7,
};

export interface TableProps {
  googleSheetsService: GoogleSheetsService;
  title: SheetsTitles;
  isHorizontal?: boolean;
  options?: PaginationOptions;
}

const Table: React.SFC<TableProps> = ({
  googleSheetsService,
  title,
  isHorizontal,
  options,
}: TableProps) => {
  const [data, setData] = useState<Object[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initSheets = async () => {
      let sheetData: Object[] = [];
      let sheetColumns: Column[] = [];
      if (isHorizontal) {
        // sheetData = await googleSheetsService.getHorizontalRowsByTitle(
        //   title,
        //   options
        //   );
      } else {
        sheetColumns = await googleSheetsService.getCellsByTitle(
          title,
          options?.offset
        );
        sheetData = await googleSheetsService.getRowsByTitle(title);
        console.log(sheetColumns, sheetData);
      }
      setColumns(sheetColumns);
      setData(sheetData);
      setIsLoading(false);
    };

    initSheets();
  }, []);

  return isLoading ? (
    <Loader />
  ) : (
    <DataTable
      columns={columns as any}
      data={data}
      showPagination={false}
      defaultPageSize={data.length}
    />
  );
};

export default Table;
