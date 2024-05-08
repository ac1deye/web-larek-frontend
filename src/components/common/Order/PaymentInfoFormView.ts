import { IOrderPaymentInfo, PaymentType } from '../../../types';
import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/events';
import { Form } from '../../base/Form';

export type IFormChangeEvent = {
	field: string;
	value: string;
};

export type IPaymentInfoViewActions = {
	paymentClick?: (type: PaymentType) => void;
};

export class PaymentInfoFormView extends Form<IOrderPaymentInfo> {
	protected _paymentTypeCardButton: HTMLButtonElement;
	protected _paymentTypeCashButton: HTMLButtonElement;
	protected _addressInput: HTMLInputElement;

	constructor(
		protected blockName: string,
		container: HTMLFormElement,
		protected events: IEvents,
		actions: IPaymentInfoViewActions
	) {
		super(container, events);

		this._paymentTypeCardButton = ensureElement<HTMLButtonElement>(
			'button[name=card]',
			container
		);
		this._paymentTypeCashButton = ensureElement<HTMLButtonElement>(
			'button[name=cash]',
			container
		);

		this._addressInput = container.elements.namedItem(
			'address'
		) as HTMLInputElement;

		this._paymentTypeCardButton.addEventListener('click', () =>
			actions.paymentClick(PaymentType.Card)
		);

		this._paymentTypeCashButton.addEventListener('click', () =>
			actions.paymentClick(PaymentType.Cash)
		);
	}

	set payment(value: PaymentType) {
		switch (value) {
			case PaymentType.Card:
				this._paymentTypeCardButton.classList.add('button_alt-active');
				this._paymentTypeCashButton.classList.remove('button_alt-active');
				break;
			case PaymentType.Cash:
				this._paymentTypeCardButton.classList.remove('button_alt-active');
				this._paymentTypeCashButton.classList.add('button_alt-active');
				break;
			case undefined:
				this._paymentTypeCardButton.classList.remove('button_alt-active');
				this._paymentTypeCashButton.classList.remove('button_alt-active');
		}
	}

	set address(value: string) {
		this._addressInput.value = value;
	}
}
