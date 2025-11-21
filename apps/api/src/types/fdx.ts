// Customer types
interface CustomerPreferences {
	notifications: boolean;
	twoFactorAuth: boolean;
}

export interface Customer {
	customerId: string;
	name: string;
	email: string;
	status: string;
	createdDate: string;
	preferences: CustomerPreferences;
}

export interface CustomerFilters {
	status?: string;
}

// Account types
interface Currency {
	currencyCode: string;
}

export interface Account {
	accountCategory: string;
	accountId: string;
	accountNumberDisplay: string;
	productName: string;
	status: string;
	currency: Currency;
	accountType: string;
	currentBalance: number;
	availableBalance?: number;
	availableCredit?: number;
	creditLine?: number;
	accountNumber?: string;
	principalBalance?: number;
	originalPrincipal?: number;
	interestRate?: number;
	interestRateType?: string;
	loanTerm?: number;
}

interface Name {
	first: string;
	middle?: string;
	last: string;
	suffix?: string;
}

interface Holder {
	relationship: string;
	name: Name;
}

interface Address {
	line1: string;
	line2?: string;
	city: string;
	region: string;
	postalCode: string;
	country: string;
}

interface Telephone {
	type: string;
	country: string;
	number: string;
}

export interface AccountContact {
	holders: Holder[];
	emails: string[];
	addresses: Address[];
	telephones: Telephone[];
}

interface Link {
	href: string;
	rel: string;
	action: string;
	types: string[];
}

export interface Statement {
	accountId: string;
	statementId: string;
	statementDate: string;
	description: string;
	links: Link[];
	status: string;
}

export interface Transaction {
	accountCategory: string;
	transactionType: string;
	checkNumber?: number;
	payee?: string;
	transactionId: string;
	postedTimestamp: string;
	transactionTimestamp: string;
	description: string;
	debitCreditMemo: string;
	status: string;
	amount: number;
}

export interface PaymentNetwork {
	bankId: string;
	identifier: string;
	type: string;
	transferIn: boolean;
	transferOut: boolean;
}

// Paginated result types
export interface PaginatedAccountsResult {
	accounts: Account[];
	total: number;
}

export interface PaginatedStatementsResult {
	statements: Statement[];
	total: number;
}

export interface PaginatedTransactionsResult {
	transactions: Transaction[];
	total: number;
}

export interface PaginatedPaymentNetworksResult {
	paymentNetworks: PaymentNetwork[];
	total: number;
}

export interface PaginatedAssetTransferNetworksResult {
	assetTransferNetworks: PaymentNetwork[];
	total: number;
}
