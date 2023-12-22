const spreadSheetContainer = document.querySelector("#spreadsheet-container");
const exportBtn = document.querySelector("#export-btn");

const ROWS = 10;
const COLS = 10;
const spreadSheet = [];

const alphabets = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

class Cell {
  constructor(isHeader, disabled, data, row, column, active = false) {
    this.isHeader = isHeader;
    this.disabled = disabled;
    this.data = data;
    this.row = row;
    this.rowName = row;
    this.column = column;
    this.columnName = alphabets[column - 1];
    this.active = active;
  }
}

exportBtn.onclick = function (e) {
  let csv = "";
  for (let i = 0; i < spreadSheet.length; i++) {
    if (i === 0) continue;
    csv +=
      spreadSheet[i]
        .filter((item) => !item.isHeader)
        .map((item) => item.data)
        .join(",") + "\r\n";
  }
  const csvObj = new Blob([csv]);
  const csvUrl = URL.createObjectURL(csvObj);

  const a = document.createElement("a");
  a.href = csvUrl;
  a.download = "SpreadSheet File Name.csv";
  a.click();
};

initSpreadSheet();

function initSpreadSheet() {
  for (let i = 0; i < ROWS; i++) {
    let spreadSheetRow = [];
    for (let j = 0; j < COLS; j++) {
      let cellData = "";
      let isHeader = false;
      if (i === 0) {
        cellData = alphabets[j - 1];
        isHeader = true;
      }

      if (j === 0) {
        isHeader = true;
        cellData = i;
      }

      if (cellData <= 0) {
        cellData = "";
      }

      const cell = new Cell(isHeader, isHeader, cellData, i, j, false);
      spreadSheetRow.push(cell);
    }
    spreadSheet.push(spreadSheetRow);
  }
  drawSheet();
}

function createCellEl(cell) {
  const cellEl = document.createElement("input");
  cellEl.className = "cell";
  cellEl.id = "cell_" + cell.row + cell.column;
  cellEl.value = cell.data;
  cellEl.disable = cell.disabled;

  if (cell.isHeader) {
    cellEl.classList.add("header");
  }
  cellEl.onchange = (e) => {
    cell.data = e.target.value;
  };
  cellEl.addEventListener("click", () => handleCellClick(cell));
  return cellEl;
}

function handleCellClick(cell) {
  clearHeaderActiveStates();
  const columnHeader = spreadSheet[0][cell.column];
  const rowHeader = spreadSheet[cell.row][0];

  const columnHeaderEl = getElFromRowCol(columnHeader.row, columnHeader.column);
  const rowHeaderEl = getElFromRowCol(rowHeader.row, rowHeader.column);

  columnHeaderEl.classList.add("active");
  rowHeaderEl.classList.add("active");
  document.querySelector("#cell-status").innerHTML =
    cell.columnName + cell.rowName;
}

function getElFromRowCol(row, col) {
  return document.querySelector("#cell_" + row + col);
}

function clearHeaderActiveStates() {
  const headers = document.querySelectorAll(".header");

  headers.forEach((header) => {
    header.classList.remove("active");
  });
}

function drawSheet() {
  for (let i = 0; i < spreadSheet.length; i++) {
    const rowContainerEl = document.createElement("div");
    rowContainerEl.className = "cell-row";
    for (let j = 0; j < spreadSheet[i].length; j++) {
      const cell = spreadSheet[i][j];
      rowContainerEl.append(createCellEl(cell));
    }
    spreadSheetContainer.append(rowContainerEl);
  }
}
