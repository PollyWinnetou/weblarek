import { ensureElement } from "../../utils/utils"; 
import { Component } from "../base/Component"; 
import { IEvents } from "../base/Events";

interface ISuccess {
  sum: number;
}

export class Success extends Component <ISuccess> {
  protected totalPrice: HTMLElement;
  protected buttonSuccess: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.totalPrice = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.buttonSuccess = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    this.buttonSuccess.addEventListener('click', () => {
      this.events.emit('done:click')
    })
  }
  set sum(value: number) {
    this.totalPrice.textContent = `Списано ${value.toString()} синапсов`;
  }
}