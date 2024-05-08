import { ensureElement } from '../../../utils/utils';
import { Component } from '../../base/Component';

export interface ICardActions {
	onClick?: (event: MouseEvent) => void;
	remove?: (id: string) => void;
}

export type ICard = {
	id: string;
	title: string;
	price: number;
};

export abstract class CardView extends Component<ICard> implements ICard {
	protected _title: HTMLElement;
	protected _price: HTMLElement;

	constructor(protected blockName: string, container: HTMLElement) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this._title.textContent = value;
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set price(value: number) {
		const text = value ? `${value} синапсов` : 'Бесценно';
		this._price.textContent = text;
	}
}
