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
  items: Array<string> = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  itemTable: Array<string[]> = new Array(this.items.length);

  getTableRow(articleRowElement: Element, index: number): string[] {
    const columnSize = this.getColumnSize(articleRowElement, index);
    const column = index % columnSize;
    if (column == 0) {
      const row = this.getRow(index, columnSize);
      let data = this.itemTable[row];
      if (!data) {
        data = this.items.slice(row * columnSize, (row + 1) * columnSize);
        this.itemTable[row] = data;
      }
      return data;
    }
    return [];
  }

  getColumnSize(articleRowElement: Element, index: number): number {
    const { width } = articleRowElement.getBoundingClientRect();
    const columnSize = (width - (width % this.boxWidth)) / this.boxWidth;
    return columnSize;
  }

  getRow(index: number, columnSize: number) {
    const column = index % columnSize;
    return (index - column) / columnSize;
  }

  reorderDroppedItem(event: CdkDragDrop<string[]>) {
    const { previousIndex, currentIndex } = event;

    const previousRowItem = event.previousContainer.data[previousIndex];
    const currentRowItem =
      event.container.data[currentIndex - 1];

    const previousItemsIndex = this.items.indexOf(previousRowItem);
    let currentItemsIndex =
      this.items.indexOf(currentRowItem) + 1;
    if (
      previousItemsIndex < currentItemsIndex &&
      event.previousContainer != event.container
    ) {
      currentItemsIndex--;
    }

    moveItemInArray(this.items, previousItemsIndex, currentItemsIndex);

    this.updateItemTable();
  }

  updateItemTable() {
    let index = 0;
    this.itemTable = this.itemTable.map(row =>
      row.map(articleFormGroup => this.items[index++])
    );
  }

}
