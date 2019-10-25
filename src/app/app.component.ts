import { Component } from "@angular/core";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";

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
      .map(
        _ =>
          Array(columnSize) // always fills to end of column size, therefore...
            .fill("")
            .map(_ => copy.shift())
            .filter(item => !!item) // ... we need to remove empty items
      );
    return this.tableRows;
  }

  reorderDroppedItem(event: CdkDragDrop<number[]>) {
    // clone table, since it needs to be re-initialized after dropping
    let copyTableRows = this.tableRows.map(_ => _.map(_ => _));

    // drop item
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    // update items after drop
    this.items = this.tableRows.reduce((previous, current) =>
      previous.concat(current)
    );

    // re-initialize table
    let index = 0;
    this.tableRows = copyTableRows.map(row =>
      row.map(_ => this.items[index++])
    );
  }
}
