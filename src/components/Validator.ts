import {
	IOrderPaymentInfo,
	IOrderUserData,
	IValidator,
	IValidatorRule,
} from '../types';

export class Validator implements IValidator {
	protected _validator: IValidatorRule<object>;

	setValidator(value: IValidatorRule<object>): Validator {
		this._validator = value;
		return this;
	}

	validate(value: object): { valid: boolean; errors: string[] } {
		if (!this._validator) throw new Error('No validation rule');
		return this._validator.validate(value);
	}
}

export class OrderValidatorRule implements IValidatorRule<IOrderPaymentInfo> {
	validate(value: IOrderPaymentInfo): { valid: boolean; errors: string[] } {
		const isValid =
			value.payment !== undefined && (value.address ?? '').length > 5;
		const errors: string[] = [];

		if (value.payment === undefined) errors.push('Выберите способ оплаты');
		if ((value.address ?? '').length <= 5)
			errors.push('Минимальная длинна адреса - 5 символов');

		return { valid: isValid, errors: errors };
	}
}

export class UserDataValidatiorRule implements IValidatorRule<IOrderUserData> {
	validate(value: IOrderUserData): { valid: boolean; errors: string[] } {
		const phoneValid =
			(
				value.phone.match(
					/^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/gm
				) ?? []
			).length > 0;
		const emailValid =
			(value.email.match(/^[^\.\s][\w\-\.{2,}]+@([\w-]+\.)+[\w-]{2,}$/gm) ?? [])
				.length > 0;

		const errors: string[] = [];
		if (!phoneValid) errors.push('Введите номер телефона');
		if (!emailValid) errors.push('Введите почту');

		return { valid: phoneValid && emailValid, errors: errors };
	}
}
