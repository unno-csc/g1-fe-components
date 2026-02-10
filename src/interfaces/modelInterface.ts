export interface IVehicleModel {
	itemCode: string;
	itemSuffix: string;
	brandName: string;
	isActive: boolean;
	itemDescription: string;
	relationshipDescription: string;
	countryName: string;
	className: string;
	subclassName: string;
	antTypeDescription: string;
	antSubtypeDescription: string;
	displacement: number;
	capacity: number;
	tonnage: number;
	transmissionDescription: string;
	requiresCustomerProfile: boolean;
	ivaDescription: string;
	ecoValueDescription: string;
	qrCommercialCode: string;
	depreciationPercentages: Array<{ year: number; depreciationPercentage: number }>;
	images: string[];
	interestDetails: Array<{
		id: number;
		modelYear: number;
		quotaFrom: number;
		quotaTo: number;
		interestRate: number;
	}>;
}