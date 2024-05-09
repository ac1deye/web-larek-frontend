import { Component } from '../components/base/Component';

export interface ILarekAPI {
	getProductList(): Promise<IProduct[]>;
	getProductItem(id: string): Promise<IProduct>;
	order(order: IOrderForm): Promise<IOrderResult>;
}

export enum ProductCategory {
	soft = 'софт-скил',
	hard = 'хард-скил',
	other = 'другое',
	additional = 'дополнительное',
	button = 'кнопка',
}

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: ProductCategory;
	price: number;
}

export enum PaymentType {
	Card = 'online',
	Cash = 'offline',
}
export interface IOrderPaymentInfo {
	payment: PaymentType;
	address: string;
}

export interface IOrderUserData {
	email: string;
	phone: string;
}

export interface IOrederProducts {
	total: number;
	items: string[];
}

export type IOrderForm = IOrderPaymentInfo & IOrderUserData & IOrederProducts;

export interface IOrderResult {
	id: string;
	total: number;
}

// Модели
export interface IBasketModel {
	items: IProduct[];
	totalPrice: number;
	add(product: IProduct): void;
	remove(id: string): void;
	contains(id: string): boolean;
	reset(): void;
}

export interface ICatalogModel {
	items: IProduct[];
	setItems(items: IProduct[]): void;
	getItem(id: string): IProduct | undefined;
}

export interface IOrderModel {
	payment: PaymentType;
	address: string;
	email: string;
	phone: string;
	reset(): void;
}

// Валидация
export interface IValidator {
	validate(value: object): { valid: boolean; errors: string[] };
}

export interface IValidatorRule<T> {
	validate(value: T): { valid: boolean; errors: string[] };
}

export interface IPage {
	counter: number;
	locked: boolean;
	catalog: HTMLElement[];
}

export interface IModalRouter {
	route<T>(to: Component<T>, data?: Partial<T>): void;
}

export interface IModalData {
	content: HTMLElement;
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}
