import { IOrderUserData } from '../../../types';
import { IEvents } from '../../base/events';
import { Form } from '../../base/Form';

export class UserDataFormView extends Form<IOrderUserData> {
	protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
		this._emailInput = container.elements.namedItem(
			'email'
		) as HTMLInputElement;
		this._phoneInput = container.elements.namedItem(
			'phone'
		) as HTMLInputElement;
	}

	set email(value: string) {
		this._emailInput.value = value;
	}
	set phone(value: string) {
		this._phoneInput.value = value;
	}
}
