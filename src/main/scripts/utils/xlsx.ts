import * as XLSX from 'xlsx';

const XLSXStyle = require('cptable-fixed-xlsx-style');

export function excelDateToISODate(excelDateNumber: number) {
  return new Date(Math.round((excelDateNumber - 25569) * 86400 * 1000));
}

export function openBook<T = unknown>(path: string, options?: XLSX.ParsingOptions) {
  const workbook = XLSX.readFile(path, options);
  const outObj: Record<string, Array<T>> = {};
  workbook.SheetNames.forEach((sheetName) => {
    outObj[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  });
  return outObj;
}

export function openSingleBook<T = unknown>(path: string, options?: XLSX.ParsingOptions) {
  const workbook = XLSX.readFile(path, options);
  const outObj: Record<string, Array<T>> = {};
  workbook.SheetNames.forEach((sheetName) => {
    outObj[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      raw: true
    });
  });
  const values: Array<Array<T>> = Object.values(outObj).filter((val) => val.length);
  if (values.length === 1) return values[0];
  throw `File is not a single worksheet: ${path}`;
}

export function openSelectedBook<T = unknown>(
  path: string,
  sheetName = 'Sheet1',
  options?: XLSX.ParsingOptions
) {
  const workbook = XLSX.readFile(path, options);
  const outObj: Array<T> = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  if (!outObj) throw `File is not a single worksheet: ${path}`;
  return outObj;
}

type Cell = { c: number; r: number };
export type Range = { s: Cell; e: Cell };

export type aRGBType = string | { a?: number; r?: number; g?: number; b?: number };
export type StyleType = Record<string, any>;

function addHeaderRange(range: Array<Range>) {
  return range.map((each) => ({
    s: {
      c: each.s.c,
      r: each.s.r + 1
    },
    e: {
      c: each.e.c,
      r: each.e.r + 1
    }
  }));
}

export function styleBook(
  path: string,
  payload?: {
    title?: string;
    merge?: Array<Range>;
    cols?: Array<number>;
    rows?: Array<number>;
    paint?: Array<{ i: number; j: number; aRGB: aRGBType }>;
    style?: Array<{ i: number; j: number; style: StyleType }>;
  }
) {
  if (!payload) return;
  if (!payload.merge && !payload.cols && !payload.paint && !payload.style && !payload.rows) return;
  const stylebook = XLSXStyle.readFile(path);
  const stylesheet = payload.title
    ? stylebook.Sheets[payload.title]
    : stylebook.Sheets[stylebook.SheetNames[0]];
  if (payload.merge) stylesheet['!merges'] = addHeaderRange(payload.merge);
  if (payload.cols) {
    const colWidth = payload.cols.map((num) => ({
      wpx: (num + 0.590807) / 0.142172,
      wch: 1
    }));
    stylesheet['!cols'] = colWidth;
  }
  if (payload.rows) {
    const rowWidth = payload.rows.map((num) => ({
      wpx: num
    }));
    stylesheet['!rows'] = rowWidth;
  }
  if (payload.paint) {
    payload.paint.forEach(({ i, j, aRGB }) => {
      let rgb: string;
      if (typeof aRGB === 'string') rgb = aRGB;
      else {
        const { a, r, g, b } = aRGB;
        rgb = `${a === undefined ? '128' : a.toString(16)}${
          r === undefined ? '128' : r.toString(16)
        }${g === undefined ? '128' : g.toString(16)}${b === undefined ? '128' : b.toString(16)}`;
      }
      const cell = stylesheet[XLSX.utils.encode_cell({ c: j, r: i + 1 })];
      if (cell) cell.s = { ...cell.s, fill: { fgColor: { rgb } } };
    });
  }
  if (payload.style) {
    payload.style.forEach(({ i, j, style }) => {
      const cell = stylesheet[XLSX.utils.encode_cell({ c: j, r: i + 1 })];
      if (cell) cell.s = { ...cell.s, ...style };
    });
  }
  XLSXStyle.writeFile(stylebook, path);
}

export function styleBooks(
  path: string,
  payloads?: Array<{
    title?: string;
    merge?: Array<Range>;
    cols?: Array<number>;
    rows?: Array<number>;
    paint?: Array<{ i: number; j: number; aRGB: aRGBType }>;
    style?: Array<{ i: number; j: number; style: StyleType }>;
  }>
) {
  if (!payloads) return;
  const stylebook = XLSXStyle.readFile(path);
  payloads?.forEach((payload, idx) => {
    if (!payload) return;
    if (!payload.merge && !payload.cols && !payload.paint && !payload.style && !payload.rows)
      return;
    const stylesheet = payload.title
      ? stylebook.Sheets[payload.title]
      : stylebook.Sheets[stylebook.SheetNames[idx]];
    if (payload.merge) stylesheet['!merges'] = addHeaderRange(payload.merge);
    if (payload.cols) {
      const colWidth = payload.cols.map((num) => ({
        wpx: (num + 0.59) / 0.1428,
        wch: 1
      }));
      stylesheet['!cols'] = colWidth;
    }
    if (payload.rows) {
      const rowWidth = payload.rows.map((num) => ({
        wpx: num
      }));
      stylesheet['!rows'] = rowWidth;
    }
    if (payload.paint) {
      payload.paint.forEach(({ i, j, aRGB }) => {
        let rgb: string;
        if (typeof aRGB === 'string') rgb = aRGB;
        else {
          const { a, r, g, b } = aRGB;
          rgb = `${a === undefined ? '128' : a.toString(16)}${
            r === undefined ? '128' : r.toString(16)
          }${g === undefined ? '128' : g.toString(16)}${b === undefined ? '128' : b.toString(16)}`;
        }
        const cell = stylesheet[XLSX.utils.encode_cell({ c: j, r: i + 1 })];
        if (cell) cell.s = { ...cell.s, fill: { fgColor: { rgb } } };
      });
    }
    if (payload.style) {
      payload.style.forEach(({ i, j, style }) => {
        const cell = stylesheet[XLSX.utils.encode_cell({ c: j, r: i + 1 })];
        if (cell) cell.s = { ...cell.s, ...style };
      });
    }
  });
  XLSXStyle.writeFile(stylebook, path);
}

export function writeBook(
  path: string,
  _json: Record<string, unknown>[],
  payload: {
    header?: Array<string>;
    title?: string;
    merge?: Array<Range>;
    cols?: Array<number>;
    rows?: Array<number>;
    paint?: Array<{ i: number; j: number; aRGB: aRGBType }>;
    style?: Array<{ i: number; j: number; style: StyleType }>;
  } = {}
) {
  const { header, title = 'Sheet 1' } = payload;
  const json: Array<unknown> = header
    ? _json.map((row) => {
        const output: Record<string, unknown> = {};
        header.forEach((key) => {
          if (row[key] !== undefined) output[key] = row[key];
        });
        return output;
      })
    : _json;
  const worksheet = XLSX.utils.json_to_sheet(json, { header });

  const outputWorkbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(outputWorkbook, worksheet, title);
  XLSX.writeFile(outputWorkbook, path);

  styleBook(path, payload);
}

export function writeBooks(
  path: string,
  _jsons: Array<Array<Record<string, unknown>>>,
  payloads?: Array<{
    header?: Array<string>;
    title?: string;
    merge?: Array<Range>;
    cols?: Array<number>;
    rows?: Array<number>;
    paint?: Array<{ i: number; j: number; aRGB: aRGBType }>;
    style?: Array<{ i: number; j: number; style: StyleType }>;
  }>
) {
  const outputWorkbook = XLSX.utils.book_new();
  _jsons.forEach((_json, idx) => {
    const payload = payloads ? payloads[idx] : {};
    const { header, title = `Sheet ${idx + 1}` } = payload || {};
    const json: Array<unknown> = header
      ? _json.map((row) => {
          const output: Record<string, unknown> = {};
          header.forEach((key) => {
            if (row[key] !== undefined) output[key] = row[key];
          });
          return output;
        })
      : _json;
    const worksheet = XLSX.utils.json_to_sheet(json, { header });

    XLSX.utils.book_append_sheet(outputWorkbook, worksheet, title);
  });
  XLSX.writeFile(outputWorkbook, path);

  styleBooks(path, payloads);
}

const borderStyle = {
  style: 'thin',
  color: { auto: 1 }
};

const border = {
  top: borderStyle,
  bottom: borderStyle,
  left: borderStyle,
  right: borderStyle
};

export const style = {
  header: {
    font: {
      name: 'TH SarabunPSK',
      sz: '20',
      bold: true
    },
    alignment: {
      vertical: 'center',
      horizontal: 'center'
    }
  },
  subheaderCenter: {
    font: {
      name: 'TH SarabunPSK',
      sz: '11'
    },
    alignment: {
      vertical: 'center',
      horizontal: 'center'
    }
  },
  subheaderLeft: {
    font: {
      name: 'TH SarabunPSK',
      sz: '11'
    },
    alignment: {
      vertical: 'center',
      horizontal: 'left'
    }
  },
  cellHeader: {
    font: {
      name: 'TH SarabunPSK',
      sz: '16',
      bold: true
    },
    alignment: {
      vertical: 'center',
      horizontal: 'center'
    },
    border
  },
  cell: {
    font: {
      name: 'TH SarabunPSK',
      sz: '16'
    },
    alignment: {
      vertical: 'center',
      horizontal: 'center'
    },
    border
  },
  cellLeft: {
    font: {
      name: 'TH SarabunPSK',
      sz: '16'
    },
    alignment: {
      vertical: 'center',
      horizontal: 'left'
    },
    border
  },
  cellHeader2: {
    font: {
      name: 'TH SarabunPSK',
      sz: '16',
      bold: true
    },
    alignment: {
      vertical: 'center',
      horizontal: 'center'
    },
    border
  },
  cell2: {
    font: {
      name: 'TH SarabunPSK',
      sz: '14'
    },
    alignment: {
      vertical: 'center',
      horizontal: 'center'
    },
    border
  },
  cellLeft2: {
    font: {
      name: 'TH SarabunPSK',
      sz: '14'
    },
    alignment: {
      vertical: 'center',
      horizontal: 'left'
    },
    border
  },
  cellLarge2: {
    font: {
      name: 'TH SarabunPSK',
      sz: '48'
    },
    alignment: {
      vertical: 'center',
      horizontal: 'center'
    },
    border
  }
};

export default {
  openBook,
  openSingleBook,
  openSelectedBook,
  styleBook,
  styleBooks,
  writeBook,
  writeBooks
};
