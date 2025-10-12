import { IProduct } from "../../../types/index.ts";

export class Products {
  protected items: IProduct[] = [];
  protected selectedItem: IProduct | null = null;

  constructor(items: IProduct[], selectedItem: IProduct | null) {
    this.items = items;
    this.selectedItem = selectedItem;
  };

  setItems(items: IProduct[]): void  {
    this.items = items;
  };

  getItems(): IProduct[] {
    return this.items;
  }

  getItemId(id: string) {
    return this.items.find(item => item.id == id);
  }

  setSelectedItem(selectedItem: IProduct | null): void {
    if (selectedItem == null) {
      this.selectedItem = null;
    } else {
      this.selectedItem = {...selectedItem};
    }
  }

  getSelectedItem() {
    return {...this.selectedItem};
  }
}