import { ensureElement } from "../../../../utils/utils";
import { Component } from "../../Component";

export abstract class Card<IProduct> extends Component<IProduct> {
  protected cardTitle: HTMLElement;
  protected cardPrice: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    
    this.cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
    this.cardPrice = ensureElement<HTMLElement>('.card__price', this.container);
  }

  set title(value: string) {
    this.cardTitle.textContent = value;
  }

  set price(value: number | null) {
    if(value === null) {
      this.cardPrice.textContent = 'Бесценно'
    } else {
      this.cardPrice.textContent = `${value} синапсов`;
    }
  }
}