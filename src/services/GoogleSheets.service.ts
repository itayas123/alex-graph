import {
  GoogleSpreadsheet,
  GoogleSpreadsheetRow,
  PaginationOptions,
} from "google-spreadsheet";
import { SheetsColumns, SheetsTitles } from "../components/Table";

class GoogleSheetsService {
  private _doc: GoogleSpreadsheet;

  constructor() {
    this._doc = new GoogleSpreadsheet(
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
    sheetTitle: string,
    options?: PaginationOptions
  ): Promise<GoogleSpreadsheetRow[]> {
    const sheet = this._doc.sheetsByTitle[sheetTitle];
    return await sheet.getRows(options);
  }

  async getCellsByTitle(
    sheetTitle: SheetsTitles,
    rowIndex: number = 0
  ): Promise<{ Header: string; accessor: string }[]> {
    const cells: { Header: string; accessor: string }[] = [];
    const sheet = this._doc.sheetsByTitle[sheetTitle];
    await sheet.loadCells();
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

  async getHorizontalRowsByTitle(
    sheetTitle: string,
    options?: PaginationOptions
  ): Promise<{ [key: string]: string }> {
    const rows = await this.getRowsByTitle(sheetTitle, options);
    const cells = await this.getCellsByTitle(sheetTitle as SheetsTitles);
    console.log(rows[0], cells);
    const firstCell = cells[0].Header;
    const secondCell = cells[1].Header;
    const data: { [key: string]: string } = { [firstCell]: secondCell };
    rows.forEach((row: GoogleSpreadsheetRow) => {
      data[row[firstCell]] = row[secondCell];
    });
    return data;
  }
}

export default GoogleSheetsService;
