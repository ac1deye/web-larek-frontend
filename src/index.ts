import './scss/styles.scss';
import { LarekAPI } from './components/LarekAPI';
import { PageView } from './components/PageView';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { BasketView, IBasket } from './components/common/Basket/BasketView';
import { CatalogView } from './components/common/Catalog/CatalogView';
import {
	CatalogChangeEvent,
	CatalogModel,
} from './components/common/Catalog/CatalogModel';
import {
	IOrderPaymentInfo,
	IOrderUserData,
	IFormState,
} from './types';
import { ModalRouter } from './components/common/Modal/ModalRouter';
import { PreviewCardView } from './components/common/Cards/PreviewCardView';
import {
	BasketChangeEvent,
	BasketModel,
} from './components/common/Basket/BasketModel';
import {
	IFormChangeEvent,
	PaymentInfoFormView,
} from './components/common/Order/PaymentInfoFormView';
import { OrderModel } from './components/common/Order/OrderModel';
import { UserDataFormView } from './components/common/Order/UserDataFormView';
import { SuccessView } from './components/common/Order/SuccessView';
import {
	OrderValidatorRule,
	UserDataValidatiorRule,
	Validator,
} from './components/Validator';

const events = new EventEmitter();

const api = new LarekAPI(CDN_URL, API_URL);
const page = new PageView(document.body, events);

const validator = new Validator();

const modalTemplate = ensureElement<HTMLTemplateElement>('#modal-container');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');

const modalRouter = new ModalRouter(modalTemplate, events);

const catalogModel = new CatalogModel(events);
const orderModel = new OrderModel(events);
const basketModel = new BasketModel(events);

const catalogView = new CatalogView(
	ensureElement<HTMLElement>('.gallery'),
	ensureElement<HTMLTemplateElement>('#card-catalog'),
	events,
	{
		onClick: (event) => events.emit('item:click', event),
	}
);

// Форма ввода данных заказа
const paymentInfoFormView = new PaymentInfoFormView(
	'order',
	cloneTemplate(orderTemplate),
	events,
	{
		paymentClick: (type) => {
			orderModel.payment = type;
		},
	}
);

// Форма ввода данных пользователя
const userDataFormView = new UserDataFormView(
	cloneTemplate(contactsTemplate),
	events
);

// Корзина
const basketView = new BasketView(
	'basket',
	cloneTemplate(basketTemplate),
	events,
	{
		remove: (id) => basketModel.remove(id),
	},
	{
		purchase: () => {
			const result = validator
				.setValidator(new OrderValidatorRule())
				.validate(orderModel);
			modalRouter.route<IOrderPaymentInfo & IFormState>(paymentInfoFormView, {
				address: orderModel.address,
				payment: orderModel.payment,
				valid: result.valid,
				errors: result.errors,
			});
		},
	}
);

// Рендерим товары
events.on<CatalogChangeEvent>('catalog:change', (event) => {
	catalogView.render(event.products);
});

// Нажатие на товар в каталоге, открываем превью карточки
events.on<MouseEvent>('item:click', (event) => {
	const id = (event.currentTarget as HTMLElement).dataset.id;
	const item = catalogModel.getItem(id);
	if (item) {
		const template = ensureElement<HTMLTemplateElement>('#card-preview');
		const preview = new PreviewCardView(cloneTemplate(template), {
			onClick: () => {
				if (basketModel.items.some((exist) => exist.id == item.id)) {
					basketModel.remove(item.id);
				} else {
					basketModel.add(item);
				}
				modalRouter.close();
			},
		});
		const buttonTitle = basketModel.contains(item.id) ? 'Удалить' : 'Купить';
		modalRouter.route(preview, { ...item, buttonTitle: buttonTitle });
	}
});

// Открываем корзину
events.on('basket:open', () => {
	modalRouter.route<IBasket>(basketView, {
		items: basketModel.items,
		total: basketModel.totalPrice,
	});
});

// Изменение наполнения корзины
events.on<BasketChangeEvent>('basket:changed', () => {
	basketView.render({
		items: basketModel.items,
		total: basketModel.totalPrice,
	});

	page.render({
		counter: basketModel.items.length,
	});
});

// Изменение формы ввода данных заказа
events.on<IOrderPaymentInfo>('order:payment-change', (event) => {
	const result = validator
		.setValidator(new OrderValidatorRule())
		.validate(orderModel);

	paymentInfoFormView.render({
		payment: event.payment,
		valid: result.valid,
		errors: result.errors,
	});
});

// Изменение формы адреса
events.on<IFormChangeEvent>('order.address:change', (event) => {
	orderModel.address = event.value;
});

// Открываем форму ввода данных пользователя
events.on('order:submit', () => {
	const result = validator
		.setValidator(new UserDataValidatiorRule())
		.validate(orderModel);

	modalRouter.route<IOrderUserData & IFormState>(userDataFormView, {
		phone: orderModel.phone,
		email: orderModel.email,
		valid: result.valid,
		errors: result.errors,
	});
});

// Изменение формы ввода данных пользователя
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderUserData; value: string }) => {
		orderModel[data.field] = data.value;

		const result = validator
			.setValidator(new UserDataValidatiorRule())
			.validate(orderModel);

		userDataFormView.render({
			valid: result.valid,
			errors: result.errors,
		});
	}
);

// Оформляем заказ
events.on('contacts:submit', () => {
	api
		.order({
			payment: orderModel.payment,
			email: orderModel.email,
			phone: orderModel.phone,
			address: orderModel.address,
			total: basketModel.totalPrice,
			items: basketModel.items.map((item) => item.id),
		})
		.then((result) => {
			basketModel.reset();
			orderModel.reset();

			const successTemplate = ensureElement<HTMLTemplateElement>('#success');
			const successView = new SuccessView(
				'order-success',
				cloneTemplate(successTemplate),
				{
					onClick: () => modalRouter.close(),
				}
			);
			modalRouter.route(successView, result);
		})
		.catch(console.error);
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

// Запрашиваем карточки
api
	.getProductList()
	.then(catalogModel.setItems.bind(catalogModel))
	.catch((err) => {
		console.error(err);
	});