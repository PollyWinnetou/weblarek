import { ensureElement } from "../../../../utils/utils";
import { IEvents } from "../../Events";
import { Form } from "./Form";

export class Order extends Form {
  protected buttonOnline: HTMLButtonElement;
  protected buttonReceive: HTMLButtonElement;
  protected inputAddress: HTMLInputElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container, events);
    this.buttonOnline = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this.buttonReceive =  ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.inputAddress = ensureElement<HTMLInputElement>('.form__input[name="address"]', this.container);

    this.buttonOnline.addEventListener('click', () => {
      const field = 'payment';
      const value = this.buttonOnline.getAttribute('name')!;
      this.onInputChange(field, value);
    })

    this.buttonReceive.addEventListener('click', () => {
      const field = 'payment';
      const value = this.buttonReceive.getAttribute('name')!;
      this.onInputChange(field, value);
    })

    this.inputAddress.addEventListener('input', () => {
      const field = 'address';
      const value = this.inputAddress.value;
      this.onInputChange(field, value);
    })
  }
}