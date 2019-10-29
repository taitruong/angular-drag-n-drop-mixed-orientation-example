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
  // one dimensional input model
  items: Array<number> = Array.from({ length: 21 }, (v, k) => k + 1);
  // two dimensional table matrix representing view model
  itemsTable: Array<number[]>;

  // fix column width as defined in CSS (150px + 5px margin)
  boxWidth = 155;
  // calculated based on dynamic row width
  columnSize: number;

  getItemsTable(rowLayout: Element): number[][] {
    // calculate column size per row
    const { width } = rowLayout.getBoundingClientRect();
    const columnSize = Math.round(width / this.boxWidth);
    // view has been resized? => update table with new column size
    if (columnSize != this.columnSize) {
      this.columnSize = columnSize;
      this.initTable();
    }
    return this.itemsTable;
  }

  initTable() {
    // calculate row size: items length / column size
    // add 0.5: round up so that last element is shown in next row
    const rowSize = Math.round(this.items.length / this.columnSize + 0.5);

    // create table rows based on input list
    // example: [1,2,3,4,5,6] => [ [1,2,3], [4,5,6] ]
    const clonedItemsList = [...this.items];
    this.itemsTable = Array(rowSize) // table: outter list
      .fill("") // fill with empty values and ...
      .map(
        // ...map with new rows
        (
          _ // row: inner list - fill row with articles from cloned list
        ) =>
          Array(this.columnSize) // always fills to end of column size, therefore...
            .fill("")
            .map(_ => clonedItemsList.shift())
            .filter(item => !!item) // ... we need to remove empty items
      );
    return this.itemsTable;
  }

  reorderDroppedItem(event: CdkDragDrop<number[]>) {
    // same row/container? => move item in same row
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // different rows? => transfer item from one to another list
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    // update items after drop: flatten matrix into list
    // example: [ [1,2,3], [4,5,6] ] => [1,2,3,4,5,6]
    this.items = this.itemsTable.reduce((previous, current) =>
      previous.concat(current)
    );

    // re-initialize table - makes sure each row has same numbers of entries
    // example: [ [1,2], [3,4,5,6] ] => [ [1,2,3], [4,5,6] ]
    this.initTable();
  }
}
