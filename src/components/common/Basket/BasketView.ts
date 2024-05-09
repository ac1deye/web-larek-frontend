import { createElement, ensureElement } from '../../../utils/utils';
import { Component } from '../../base/Component';

export type IBasket = {
	total: number;
	items: HTMLElement[];
};

export interface IBasketActions {
	purchase: () => void;
}

export class BasketView extends Component<IBasket> {
	protected _list: HTMLUListElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		protected actions?: IBasketActions
	) {
		super(container);

		this._list = ensureElement<HTMLUListElement>(
			`.${blockName}__list`,
			container
		);
		this._total = ensureElement<HTMLElement>(`.${blockName}__price`, container);
		this._button = ensureElement<HTMLButtonElement>(
			`.${blockName}__button`,
			container
		);

		if (actions) {
			this._button.addEventListener('click', actions.purchase);
		}
	}

	set total(value: number) {
		this._total.textContent = `${value} синапсов`;
		this._button.disabled = value === 0;
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}
}
