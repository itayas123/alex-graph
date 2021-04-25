import { GoogleSpreadsheet, GoogleSpreadsheetRow } from "google-spreadsheet";
import { Column } from "react-table-6";
import { SheetsColumns, SheetsTitles } from "../components/Table";

class GoogleSheetsService {
  private _doc: GoogleSpreadsheet;

  constructor() {
    this._doc = new GoogleSpreadsheet(
      "1tXEsG0qk4boX7j0V7U_Dun_v5uXDsk8iOfpK2xQagxI" ||
        "1LbIprnwWJTQYWJy8uh7E1rr1MOaSbuiHPYzjL9h0eEQ"
    );
  }

  async init() {
    const creds = require("../config/alex-graph-726c372311a6.json");
    try {
      await this._doc.useServiceAccountAuth(creds);
      await this._doc.loadInfo();
    } catch (err) {
      console.error("Failed to connect google sheets: ", err);
    }
    console.log("Success to connect google sheets and load info");
  }

  async getRowsByTitle(
    sheetTitle: SheetsTitles,
    offset?: number
  ): Promise<GoogleSpreadsheetRow[]> {
    const sheet = this._doc.sheetsByTitle[sheetTitle];
    return await sheet.getRows(
      offset ? { offset, limit: 99999999 } : undefined
    );
  }

  getCellByTitleAndIndex(
    sheetTitle: SheetsTitles,
    rowIndex: number,
    cellIndex: number
  ) {
    const sheet = this._doc.sheetsByTitle[sheetTitle];
    if (!sheet.cellStats.loaded) {
      throw new Error("not loaded");
    }
    return sheet.getCell(rowIndex, cellIndex).formattedValue;
  }

  async getCellsByTitle(
    sheetTitle: SheetsTitles,
    rowIndex: number = 0
  ): Promise<{ Header: string; accessor: string }[]> {
    const cells: { Header: string; accessor: string }[] = [];
    const sheet = this._doc.sheetsByTitle[sheetTitle];
    console.log(sheet.cellStats);
    if (!sheet.cellStats.loaded) {
      await sheet.loadCells();
    }
    const columnsCount: number = SheetsColumns[sheetTitle];
    for (let cellIndex = 0; cellIndex < columnsCount; cellIndex++) {
      const cell = sheet.getCell(rowIndex, cellIndex);
      cells[cellIndex] = {
        Header: cell.formattedValue,
        accessor: cell.formattedValue,
      };
    }
    return cells;
  }

  async getHorizontalRowsandColumnByTitle(
    sheetTitle: SheetsTitles,
    offset?: number
  ): Promise<{
    sheetColumns: Column<any>[];
    sheetData: any[];
  }> {
    const sheetColumns: Column[] = await this.getCellsByTitle(
      sheetTitle,
      offset
    );
    const sheetData: any[] = await this.getRowsByTitle(sheetTitle);
    sheetData.unshift({
      [sheetColumns[0].accessor?.toString() || ""]: sheetColumns[0].Header,
      [sheetColumns[1].accessor?.toString() || ""]: sheetColumns[1].Header,
    });
    sheetColumns.forEach((column) => {
      if (parseFloat(column.accessor?.toString().replace(/,/g, "") || "")) {
        column.accessor = "some accessor";
      }
    });
    sheetData.forEach((data) => {
      const unvalidKey = Object.keys(data).find((key) =>
        parseFloat(key.replace(/,/g, ""))
      );
      if (unvalidKey) {
        data["some accessor"] = data[unvalidKey];
      }
    });
    return { sheetColumns, sheetData };
  }
}

export default GoogleSheetsService;
