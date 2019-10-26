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
  itemsTable: Array<number[]>;

  getItemsTable(rowLayout: Element): number[][] {
    if (this.itemsTable) {
      return this.itemsTable;
    }
    // calculate column size per row
    const { width } = rowLayout.getBoundingClientRect();
    const columnSize = Math.round(width / this.boxWidth);
    // calculate row size: items length / column size
    const rowSize = Math.round(this.items.length / columnSize);

    // create table rows
    const copy = [...this.items];
    this.itemsTable = Array(rowSize)
      .fill("")
      .map(
        _ =>
          Array(columnSize) // always fills to end of column size, therefore...
            .fill("")
            .map(_ => copy.shift())
            .filter(item => !!item) // ... we need to remove empty items
      );
    return this.itemsTable;
  }

  reorderDroppedItem(event: CdkDragDrop<number[]>) {
    // clone table, since it needs to be re-initialized after dropping
    let copyTableRows = this.itemsTable.map(_ => _.map(_ => _));

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
    this.items = this.itemsTable.reduce((previous, current) =>
      previous.concat(current)
    );

    // re-initialize table
    let index = 0;
    this.itemsTable = copyTableRows.map(row =>
      row.map(_ => this.items[index++])
    );
  }
}
