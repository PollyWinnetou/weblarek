import { IProduct } from "../../../types/index.ts";
import { IEvents } from "../Events.ts";

export class Products {
  protected items: IProduct[] = [];
  protected selectedItem: IProduct;
  protected events: IEvents;

  constructor(items: IProduct[], selectedItem: IProduct, events: IEvents) {
    this.items = items;
    this.selectedItem = selectedItem;
    this.events = events;
  }

  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit('catalog:change');
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItemId(id: string) {
    return this.items.find((item) => item.id == id);
  }

  setSelectedItem(selectedItem: IProduct): void {
    this.selectedItem = { ...selectedItem };
    this.events.emit('card:select');
  }

  getSelectedItem() {
    return { ...this.selectedItem };
  }
}
