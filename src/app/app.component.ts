import { Component } from "@angular/core";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  // width 150px + 5px margin
  boxWidth = 155;
  items: Array<number> = Array.from({ length: 20 }, (v, k) => k + 1);
  tableRows: Array<number[]>;

  getTableRows(itemRow: Element): number[][] {
    if (this.tableRows) {
      return this.tableRows;
    }
    // calculate column size per row
    const { width } = itemRow.getBoundingClientRect();
    const columnSize = (width - (width % this.boxWidth)) / this.boxWidth;
    // calculate row size: items length / column size
    const rowSize = +(this.items.length / columnSize).toPrecision(1);

    // create table rows
    const copy = [...this.items];
    this.tableRows = Array(rowSize)
      .fill("")
      .map(_ =>
        Array(columnSize) // always fills to end of column size, therefore...
          .fill("")
          .map(_ => copy.shift())
          .filter(item => !!item) // ... we need to remove the empty items
      );
    return this.tableRows;
  }

  reorderDroppedItem(event: CdkDragDrop<number[]>) {
    // reorder on items array for that we need to calculate items indices
    // based on indices poiting to rows (data and previous data containers)
    const { previousIndex, currentIndex } = event;

    // get the items from the rows
    const previousRowItem = event.previousContainer.data[previousIndex];
    const currentRowItem = event.container.data[currentIndex - 1]; // currentIndex - 1: when dragging to end of row then current index is equal to row length

    // get item indices based on items
    const previousItemsIndex = this.items.indexOf(previousRowItem);
    let currentItemsIndex = this.items.indexOf(currentRowItem);
    if (event.previousContainer == event.container) {
      // increment in case of same row, keep decremented when in another row
      currentItemsIndex++;
    } else if (previousItemsIndex > currentItemsIndex) {
      // increment in case of different rows AND dragging back (prev > curr), keep decremented when in another row
    currentItemsIndex++;
    }

    // move item from previous to current index
    moveItemInArray(this.items, previousItemsIndex, currentItemsIndex);

    this.updateTableRows();
  }

  updateTableRows() {
    let index = 0;
    this.tableRows = this.tableRows.map(row =>
      row.map(_ => this.items[index++])
    );
  }
}
