import { useEffect, useState } from "react";
import { Column } from "react-table-6";
import { GoogleSpreadsheetRow } from "google-spreadsheet";
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
  offset?: number;
}

const Table: React.SFC<TableProps> = ({
  googleSheetsService,
  title,
  isHorizontal,
  offset,
}: TableProps) => {
  const [data, setData] = useState<GoogleSpreadsheetRow[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initSheets = async () => {
      if (isHorizontal) {
        const {
          sheetColumns,
          sheetData,
        } = await googleSheetsService.getHorizontalRowsandColumnByTitle(title);
        setColumns(sheetColumns);
        setData(sheetData);
      } else {
        const sheetColumns = await googleSheetsService.getCellsByTitle(
          title,
          offset
        );
        const sheetData = await googleSheetsService.getRowsByTitle(
          title,
          offset
        );
        if (offset) {
          sheetData.forEach((data, index) => {
            sheetColumns.forEach((column, columnIndex) => {
              data[column.Header] = googleSheetsService.getCellByTitleAndIndex(
                title,
                offset + index + 1,
                columnIndex
              );
            });
          });
        }
        setColumns(sheetColumns);
        setData(sheetData);
      }

      setIsLoading(false);
    };

    initSheets();
  }, [googleSheetsService, title, isHorizontal, offset]);

  return isLoading ? (
    <Loader />
  ) : (
    <DataTable
      columns={columns as any}
      data={data}
      showPagination={false}
      defaultPageSize={data.length}
      className={isHorizontal ? "is-horizontal" : ""}
    />
  );
};

export default Table;
