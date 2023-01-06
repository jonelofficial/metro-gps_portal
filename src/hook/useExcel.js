import React from "react";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

const useExcel = () => {
  const excelExport = async (obj, title) => {
    const options = {
      header: Object.keys(obj[0]).map((key) => {
        return {
          v: key,
          s: {
            font: {
              bold: true,
            },
          },
        };
      }),
    };
    const workbook = XLSX.utils.book_new(),
      worksheet = XLSX.utils.json_to_sheet(obj, options);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${title} ${dayjs().format("MMM-DD-YYYY")}.xlsx`);
  };

  const filterHeader = async (jsonData) => {
    await jsonData.map((row) => {
      Object.keys(row).map((key) => {
        let newKey = key.trim().toLowerCase().replace(/ /g, "_");
        if (key !== newKey) {
          row[newKey] = row[key];
          delete row[key];
        }
      });
    });

    return jsonData;
  };

  const excelImport = async (file) => {
    const excelFile = await file.arrayBuffer();
    const workbook = XLSX.readFile(excelFile);
    const initialWorkSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(initialWorkSheet, { raw: true });
    return await filterHeader(jsonData);
  };

  return { excelExport, excelImport };
};

export default useExcel;
