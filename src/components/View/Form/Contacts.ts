import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Form } from "./Form";

export class Contacts extends Form {
  protected inputEmail: HTMLInputElement;
  protected inputPhone: HTMLInputElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container, events);
    this.inputEmail = ensureElement<HTMLInputElement>(
      '.form__input[name="email"]',
      this.container
    );
    this.inputPhone = ensureElement<HTMLInputElement>(
      '.form__input[name="phone"]',
      this.container
    );

    this.inputEmail.addEventListener("input", () => {
      const field = "email";
      const value = this.inputEmail.value;
      this.onInputChange(field, value);
    });

    this.inputPhone.addEventListener("input", () => {
      const field = "phone";
      const value = this.inputPhone.value;
      this.onInputChange(field, value);
    });
  }

  set email(value: string) {
    this.inputEmail.value = value;
  }

  set phone(value: string) {
    this.inputPhone.value = value;
  }
}
