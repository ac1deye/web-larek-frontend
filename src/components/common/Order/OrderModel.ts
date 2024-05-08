import {
	PaymentType,
	IProduct,
	IOrderPaymentInfo,
	IOrderModel,
} from '../../../types';
import { IEvents } from '../../base/events';

export type BasketChangeEvent = {
	basket: IProduct[];
};

export class OrderModel implements IOrderModel {
	protected _payment: PaymentType;
	protected _address: string;
	protected _email: string;
	protected _phone: string;

	constructor(protected events: IEvents) {}

	set payment(value: PaymentType) {
		this._payment = value;
		this.events.emit<IOrderPaymentInfo>('order:payment-change', {
			payment: this._payment,
			address: this._address,
		});
	}

	get payment(): PaymentType {
		return this._payment;
	}

	set address(value: string) {
		this._address = value;
		this.events.emit<IOrderPaymentInfo>('order:payment-change', {
			payment: this._payment,
			address: this._address,
		});
	}

	get address(): string {
		return this._address || '';
	}

	set email(value: string) {
		this._email = value;
	}

	get email(): string {
		return this._email || '';
	}

	set phone(value: string) {
		this._phone = value;
	}

	get phone(): string {
		return this._phone || '';
	}

	reset(): void {
		this._payment = undefined;
		this._address = '';
		this._email = '';
		this._phone = '';
	}
}
