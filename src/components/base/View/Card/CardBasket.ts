import { IProduct } from "../../../../types";
import { ensureElement } from "../../../../utils/utils";
import { IEvents } from "../../Events";
import { Card } from "./Card";

export class CardBasket extends Card<IProduct & { index: number }> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    this.deleteButton.addEventListener('click', () => {
      this.events.emit('basket:delete');
    })
  }

  set index(value: number) {
    this.indexElement.textContent = value.toString();
  }
}