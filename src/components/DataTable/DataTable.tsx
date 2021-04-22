import React from "react";
import ReactTable, { TableProps } from "react-table-6";
import "react-table-6/react-table.css";
import "./dataTable.css";

const DataTable = (props: Partial<TableProps<any>>) => {
  const { data, columns, className } = props;
  return (
    <ReactTable
      data={data}
      columns={columns}
      defaultSortMethod={(a: string, b: string) => {
        if (a === b) {
          return 0;
        }
        const aValue = a.includes("/")
          ? Date.parse(a)
          : parseFloat(a.replace(/,/g, "")) || a;
        const bValue = b.includes("/")
          ? Date.parse(b)
          : parseFloat(b.replace(/,/g, "")) || b;
        return aValue > bValue ? 1 : -1;
      }}
      defaultFilterMethod={(filter, row) =>
        row[filter.id]
          ? row[filter.id]
              .toString()
              .toLowerCase()
              .includes(filter.value.toLowerCase())
          : false
      }
      {...props}
      className={`-striped -highlight ${className}`}
    />
  );
};

export default DataTable;
