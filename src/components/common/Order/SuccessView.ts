import { IOrderResult } from '../../../types';
import { ensureElement } from '../../../utils/utils';
import { Component } from '../../base/Component';

export type ISuccessViewActions = {
	onClick: () => void;
};

export class SuccessView extends Component<IOrderResult> {
	protected _button: HTMLButtonElement;
	protected _description: HTMLElement;

	constructor(
		protected blockName: string,
		container: HTMLFormElement,
		actions: ISuccessViewActions
	) {
		super(container);

		this._button = ensureElement<HTMLButtonElement>(
			`.${blockName}__close`,
			container
		);
		this._description = ensureElement<HTMLButtonElement>(
			`.${blockName}__description`,
			container
		);

		this._button.addEventListener('click', () => actions.onClick());
	}

	set total(value: number) {
		this._description.textContent = `Списано ${value} синапсов`;
	}
}
