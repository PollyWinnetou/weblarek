import { Component } from "../Component"; 

export interface IGallery {
  items: HTMLElement;
}

export class Gallery extends Component<IGallery> {

  constructor(container: HTMLElement) {
    super(container);
  }

  setItems(products: HTMLElement[]) {
    this.container.replaceChildren(...products);
  }
}