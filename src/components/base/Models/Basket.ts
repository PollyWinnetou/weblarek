import { IProduct } from "../../../types/index.ts";

export class Basket {
  protected items: IProduct[] = [];

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct) {
    this.items.push(item);
  }

  deleteItem(id: string) {
    this.items = this.items.filter((item) => item.id !== id);
  }

  clearItems() {
    this.items = [];
  }

  getTotalItems(): number {
    return this.items.reduce((total, item) => {
      if (item.price !== null) {
        return total + item.price
      } else {
        return total
      }
    }, 0);
  }

  getCountItems(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
}
