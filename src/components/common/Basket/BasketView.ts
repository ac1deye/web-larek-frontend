import { IProduct } from '../../../types';
import { cloneTemplate, ensureElement } from '../../../utils/utils';
import { Component } from '../../base/Component';
import { IEvents } from '../../base/events';
import { ICardActions } from '../Cards/CardView';
import { BasketCardView } from '../Cards/BasketCardView';

export type IBasket = {
	total: number;
	items: IProduct[];
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
		protected events: IEvents,
		protected cardActions?: ICardActions,
		protected actions?: IBasketActions
	) {
		super(container);
		this._list = ensureElement<HTMLUListElement>('.modal__title', container);
		this._total = ensureElement<HTMLElement>('.basket__price', container);
		this._button = ensureElement<HTMLButtonElement>('.button', container);

		if (actions) {
			this._button.addEventListener('click', actions.purchase);
		}
	}

	set total(value: number) {
		this._total.textContent = `${value} синапсов`;
		this._button.disabled = value === 0;
	}

	render(data?: Partial<IBasket>): HTMLElement {
		super.render(data);

		const cards = data.items.map((item, index) => {
			const card = new BasketCardView(
				cloneTemplate(ensureElement<HTMLTemplateElement>('#card-basket')),
				this.cardActions
			);
			return card.render({
				id: item.id,
				title: item.title,
				price: item.price,
				index: index + 1,
			});
		});

		this._list.replaceChildren(...cards);

		return this.container;
	}
}
