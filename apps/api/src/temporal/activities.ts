import { customers } from "../data/customers.js";
import { accounts, accountContacts, accountStatements, accountTransactions, accountPaymentNetworks } from "../data/accounts.js";
import { maybeCauseChaosAsync } from "../utils/chaos.js";
import type {
	Customer,
	CustomerFilters,
	Account,
	AccountContact,
	Statement,
	Transaction,
	PaymentNetwork,
	PaginatedAccountsResult,
	PaginatedStatementsResult,
	PaginatedTransactionsResult,
	PaginatedPaymentNetworksResult,
	PaginatedAssetTransferNetworksResult
} from "../types/fdx.js";

// Re-export types for use in workflows
export type {
	Customer,
	CustomerFilters,
	Account,
	AccountContact,
	Statement,
	Transaction,
	PaymentNetwork,
	PaginatedAccountsResult,
	PaginatedStatementsResult,
	PaginatedTransactionsResult,
	PaginatedPaymentNetworksResult,
	PaginatedAssetTransferNetworksResult
};

// Customer activities
export async function getCurrentCustomer(): Promise<Customer | null> {
	await maybeCauseChaosAsync( "getCurrentCustomer" );

	return new Promise<Customer | null>( ( resolve ) => {
		setTimeout( () => {
			const currentCustomer = customers.find( ( c: Customer ) => c.customerId === "customer-123" );
			resolve( currentCustomer || null );
		}, 75 );
	} );
}

export async function getCustomerById( customerId: string ): Promise<Customer | null> {
	await maybeCauseChaosAsync( "getCustomerById" );

	return new Promise<Customer | null>( ( resolve ) => {
		setTimeout( () => {
			const customer = customers.find( ( c: Customer ) => c.customerId === customerId );
			resolve( customer || null );
		}, 50 );
	} );
}

export async function getCustomers( filters: CustomerFilters = {} ): Promise<Customer[]> {
	await maybeCauseChaosAsync( "getCustomers" );

	return new Promise<Customer[]>( ( resolve ) => {
		setTimeout( () => {
			let filteredCustomers = [ ...customers ] as Customer[];
			if ( filters.status ) {
				filteredCustomers = filteredCustomers.filter( ( c: Customer ) => c.status === filters.status );
			}
			resolve( filteredCustomers );
		}, 100 );
	} );
}

// Account activities
export async function getAccounts( offset = 0, limit = 10 ): Promise<PaginatedAccountsResult> {
	await maybeCauseChaosAsync( "getAccounts" );

	return new Promise<PaginatedAccountsResult>( ( resolve ) => {
		setTimeout( () => {
			const paginatedAccounts = ( accounts as Account[] ).slice( offset, offset + limit );
			resolve( {
				accounts: paginatedAccounts,
				total: accounts.length
			} );
		}, 100 );
	} );
}

export async function getAccountById( accountId: string ): Promise<Account | null> {
	await maybeCauseChaosAsync( "getAccountById" );

	return new Promise<Account | null>( ( resolve ) => {
		setTimeout( () => {
			const account = ( accounts as Account[] ).find( ( acc ) => acc.accountId === accountId );
			resolve( account || null );
		}, 50 );
	} );
}

export async function getAccountContactById( accountId: string ): Promise<AccountContact | null> {
	await maybeCauseChaosAsync( "getAccountContactById" );

	return new Promise<AccountContact | null>( ( resolve ) => {
		setTimeout( () => {
			const contactInfo = ( accountContacts as Record<string, AccountContact> )[accountId];
			resolve( contactInfo || null );
		}, 50 );
	} );
}

export async function getAccountStatements( accountId: string, offset = 0, limit = 100, startTime = "", endTime = "" ): Promise<PaginatedStatementsResult> {
	await maybeCauseChaosAsync( "getAccountStatements" );

	return new Promise<PaginatedStatementsResult>( ( resolve ) => {
		setTimeout( () => {
			const startDate = startTime ? new Date( startTime ) : new Date( 0 );
			const endDate = endTime ? new Date( endTime ) : new Date( 8640000000000000 );

			const statementsForAccount = ( accountStatements as Record<string, Statement[]> )[accountId] || [];
			const statements = statementsForAccount.filter( ( statement ) => {
				const statementDate = new Date( statement.statementDate );
				return statementDate >= startDate && statementDate <= endDate;
			} );
			const paginatedStatements = statements.slice( offset, offset + limit );
			resolve( {
				statements: paginatedStatements,
				total: statements.length
			} );
		}, 100 );
	} );
}

export async function getAccountStatementById( accountId: string, statementId: string ): Promise<Statement | null> {
	await maybeCauseChaosAsync( "getAccountStatementById" );

	return new Promise<Statement | null>( ( resolve ) => {
		setTimeout( () => {
			const statementsForAccount = ( accountStatements as Record<string, Statement[]> )[accountId] || [];
			const statement = statementsForAccount.find( ( s ) => s.statementId === statementId ) || null;
			resolve( statement );
		}, 50 );
	} );
}

export async function getAccountTransactions( accountId: string, offset = 0, limit = 100, startTime = "", endTime = "" ): Promise<PaginatedTransactionsResult> {
	await maybeCauseChaosAsync( "getAccountTransactions" );

	return new Promise<PaginatedTransactionsResult>( ( resolve ) => {
		setTimeout( () => {
			const startDate = startTime ? new Date( startTime ) : new Date( 0 );
			const endDate = endTime ? new Date( endTime ) : new Date( 8640000000000000 );
			const transactionsForAccount = ( accountTransactions as Record<string, Transaction[]> )[accountId] || [];
			const filtered = transactionsForAccount.filter( ( tx ) => {
				const txDate = new Date( tx.postedTimestamp );
				return txDate >= startDate && txDate <= endDate;
			} );
			const paginated = filtered.slice( offset, offset + limit );
			resolve( {
				transactions: paginated,
				total: filtered.length
			} );
		}, 100 );
	} );
}

export async function getPaymentNetworks( accountId: string, offset = 0, limit = 100 ): Promise<PaginatedPaymentNetworksResult> {
	await maybeCauseChaosAsync( "getPaymentNetworks" );

	return new Promise<PaginatedPaymentNetworksResult>( ( resolve ) => {
		setTimeout( () => {
			const networks = ( accountPaymentNetworks as Record<string, PaymentNetwork[]> )[accountId] || [];
			const paginated = networks.slice( offset, offset + limit );
			resolve( { paymentNetworks: paginated, total: networks.length } );
		}, 100 );
	} );
}

export async function getAssetTransferNetworks( accountId: string, offset = 0, limit = 100 ): Promise<PaginatedAssetTransferNetworksResult> {
	await maybeCauseChaosAsync( "getAssetTransferNetworks" );

	return new Promise<PaginatedAssetTransferNetworksResult>( ( resolve ) => {
		setTimeout( () => {
			const networks = ( accountPaymentNetworks as Record<string, PaymentNetwork[]> )[accountId] || [];
			const paginated = networks.slice( offset, offset + limit );
			resolve( { assetTransferNetworks: paginated, total: networks.length } );
		}, 100 );
	} );
}
