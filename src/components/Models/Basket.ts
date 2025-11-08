import { IProduct } from "../../types/index.ts";
import { IEvents } from "../base/Events.ts";

export class Basket {
  protected items: IProduct[] = [];
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct) {
    this.items.push(item);
    this.events.emit('basket:change');
  }

  deleteItem(id: string) {
    this.items = this.items.filter((item) => item.id !== id);
    this.events.emit('basket:change');
  }

  clearItems() {
    this.items = [];
    this.events.emit('basket:change');
  }

  getTotalItems(): number {
    return this.items.reduce((total, item) => {
      if (item.price !== null) {
        return total + item.price;
      } else {
        return total;
      }
    }, 0);
  }

  getCountItems(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
