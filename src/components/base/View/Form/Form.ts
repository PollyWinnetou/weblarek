import { IBuyer } from "../../../../types";
import { ensureElement } from "../../../../utils/utils";
import { Component } from "../../Component";
import { IEvents } from "../../Events";

interface IForm extends IBuyer {
  error: string;
}

export class Form extends Component<IForm> {
  protected buttonForm: HTMLButtonElement;
  protected errorForm: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.buttonForm = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this.errorForm = ensureElement<HTMLElement>('.form__errors', this.container);

    this.buttonForm.addEventListener('click', () => {
      this.events.emit('form:next');
    })
  } 

  set button(value: boolean) {
    this.buttonForm.disabled = value;
  }

  set error(value: string) {
    this.errorForm.textContent = value;
  }

  onInputChange(field: keyof IBuyer, value: string) {
    this.events.emit('form:change', {
      field,
      value,
    });
  }
}