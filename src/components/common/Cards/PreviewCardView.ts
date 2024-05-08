import { ensureElement } from '../../../utils/utils';
import { ICard, ICardActions } from './CardView';
import { CatalogCardView, ICatalogCard } from './CatalogCardView';

type IPreviewCard = {
	buttonTitle: string;
};

export class PreviewCardView extends CatalogCardView implements IPreviewCard {
	protected _button: HTMLButtonElement;
	protected _description: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._button = ensureElement<HTMLButtonElement>(`.card__button`, container);
		this._description = ensureElement<HTMLButtonElement>(
			`.card__text`,
			container
		);

		if (actions?.onClick) {
			this._button.addEventListener('click', actions.onClick);
		}
	}

	set description(value: string) {
		this._description.textContent = value;
	}

	set buttonTitle(value: string) {
		this._button.textContent = value;
	}

	render(data?: Partial<IPreviewCard & ICatalogCard & ICard>): HTMLElement {
		const { id, title, price, image, category, ...inputs } = data;
		super.render({ id, title, price, image, category });
		Object.assign(this, inputs);
		return this.container;
	}
}
