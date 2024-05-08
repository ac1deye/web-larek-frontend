import { ensureElement } from '../../../utils/utils';
import { CardView, ICard, ICardActions } from './CardView';

type IBasketCard = {
	index: number;
};

export class BasketCardView extends CardView implements IBasketCard {
	protected _index: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container);

		this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
		this._button = ensureElement<HTMLButtonElement>(`.card__button`, container);

		if (actions?.remove) {
			this._button.addEventListener('click', () => actions.remove(super.id));
		}
	}

	set index(value: number) {
		this._index.textContent = String(value);
	}

	render(data?: Partial<IBasketCard & ICard>): HTMLElement {
		const { id, title, price, ...inputs } = data;
		super.render({ id, title, price });
		Object.assign(this, inputs);
		return this.container;
	}
}
