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
  sheetName: SheetsTitles;
  title: string;
  isHorizontal?: boolean;
  offset?: number;
}

const Table: React.SFC<TableProps> = ({
  googleSheetsService,
  sheetName,
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
        } = await googleSheetsService.getHorizontalRowsandColumnByTitle(
          sheetName
        );
        setColumns(sheetColumns);
        setData(sheetData);
      } else {
        const sheetColumns = await googleSheetsService.getCellsByTitle(
          sheetName,
          offset
        );
        const sheetData = await googleSheetsService.getRowsByTitle(
          sheetName,
          offset
        );
        if (offset) {
          sheetData.forEach((data, index) => {
            sheetColumns.forEach((column, columnIndex) => {
              data[column.Header] = googleSheetsService.getCellByTitleAndIndex(
                sheetName,
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
  }, [googleSheetsService, sheetName, isHorizontal, offset]);

  return isLoading ? (
    <Loader />
  ) : (
    <div>
      {title && <h3>{title}</h3>}
      <DataTable
        columns={columns as any}
        data={data}
        showPagination={false}
        defaultPageSize={data.length}
        className={isHorizontal ? "is-horizontal" : ""}
      />
    </div>
  );
};

export default Table;
