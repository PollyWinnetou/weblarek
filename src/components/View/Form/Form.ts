import { IBuyer, IForm } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export abstract class Form extends Component<IForm> {
  protected buttonForm: HTMLButtonElement;
  protected errorForm: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.buttonForm = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container
    );
    this.errorForm = ensureElement<HTMLElement>(
      ".form__errors",
      this.container
    );

    container.addEventListener("submit", (event) => {
      event.preventDefault();
      this.events.emit(`${this.container.getAttribute("name")}:submit`);
    });
  }

  set valid(isValid: boolean) {
    this.buttonForm.disabled = !isValid;
  }

  set errors(message: string) {
    this.errorForm.textContent = message;
  }

  onInputChange(field: keyof IBuyer, value: string) {
    this.events.emit("form:change", {
      field,
      value,
    });
  }
}
