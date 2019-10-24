import { Component } from "@angular/core";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  boxWidth = 155;
  items: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  itemTable: Array<number[]> = new Array(this.items.length);;

  getTableRow(articleRowElement: Element, index: number): number[] {
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

  updateItemTable() {
    let index = 0;
    this.itemTable = this.itemTable.map(row =>
      row.map(articleFormGroup => this.items[index++])
    );
  }

  getColumnSize(articleRowElement: Element, index: number): number {
    const { width } = articleRowElement.getBoundingClientRect();
    console.log('>>> total width', width);
    const columnSize = (width - (width % this.boxWidth)) / this.boxWidth;
    console.log('>>>> column size', columnSize);
    return columnSize;
  }

  getRow(index: number, columnSize: number) {
    const column = index % columnSize;
    return (index - column) / columnSize;
  }

  reorderDroppedList(event: CdkDragDrop<number[]>) {
    const { previousIndex, currentIndex } = event;

    const previousFormGroup = event.previousContainer.data[previousIndex];
    const currentFormGroup =
      currentIndex < event.container.data.length
        ? event.container.data[currentIndex]
        : event.container.data[currentIndex - 1];

    const previousSortIndex = this.items.indexOf(previousFormGroup);
    let currentSortIndex =
      currentIndex < event.container.data.length
        ? this.items.indexOf(currentFormGroup)
        : this.items.indexOf(currentFormGroup) + 1;
    if (
      previousSortIndex < currentSortIndex &&
      event.previousContainer != event.container
    ) {
      currentSortIndex--;
    }

    moveItemInArray(this.items, previousIndex, currentIndex);

    this.updateItemTable();
  }
}
