import { IGallery } from "../../types";
import { Component } from "../base/Component";

export class Gallery extends Component<IGallery> {
  constructor(container: HTMLElement) {
    super(container);
  }

  setItems(products: HTMLElement[]): void {
    this.container.replaceChildren(...products);
  }
}
