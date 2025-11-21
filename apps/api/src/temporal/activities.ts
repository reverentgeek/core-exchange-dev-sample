import { customers } from "../data/customers.js";
import { accounts, accountContacts, accountStatements, accountTransactions, accountPaymentNetworks } from "../data/accounts.js";
import { maybeCauseChaosAsync } from "../utils/chaos.js";

// Re-export types for use in workflows
export interface CustomerFilters {
	status?: string;
}

// Customer activities
export async function getCurrentCustomer() {
	await maybeCauseChaosAsync( "getCurrentCustomer" );

	return new Promise( ( resolve ) => {
		setTimeout( () => {
			const currentCustomer = customers.find( ( c ) => c.customerId === "customer-123" );
			resolve( currentCustomer || null );
		}, 75 );
	} );
}

export async function getCustomerById( customerId: string ) {
	await maybeCauseChaosAsync( "getCustomerById" );

	return new Promise( ( resolve ) => {
		setTimeout( () => {
			const customer = customers.find( ( c ) => c.customerId === customerId );
			resolve( customer || null );
		}, 50 );
	} );
}

export async function getCustomers( filters: CustomerFilters = {} ) {
	await maybeCauseChaosAsync( "getCustomers" );

	return new Promise( ( resolve ) => {
		setTimeout( () => {
			let filteredCustomers = [ ...customers ];
			if ( filters.status ) {
				filteredCustomers = filteredCustomers.filter( ( c ) => c.status === filters.status );
			}
			resolve( filteredCustomers );
		}, 100 );
	} );
}

// Account activities
export async function getAccounts( offset = 0, limit = 10 ) {
	await maybeCauseChaosAsync( "getAccounts" );

	return new Promise( ( resolve ) => {
		setTimeout( () => {
			const paginatedAccounts = accounts.slice( offset, offset + limit );
			resolve( {
				accounts: paginatedAccounts,
				total: accounts.length
			} );
		}, 100 );
	} );
}

export async function getAccountById( accountId: string ) {
	await maybeCauseChaosAsync( "getAccountById" );

	return new Promise( ( resolve ) => {
		setTimeout( () => {
			const account = accounts.find( ( acc ) => acc.accountId === accountId );
			resolve( account || null );
		}, 50 );
	} );
}

export async function getAccountContactById( accountId: string ) {
	await maybeCauseChaosAsync( "getAccountContactById" );

	return new Promise( ( resolve ) => {
		setTimeout( () => {
			const contactInfo = ( accountContacts as Record<string, unknown> )[accountId];
			resolve( contactInfo || null );
		}, 50 );
	} );
}

export async function getAccountStatements( accountId: string, offset = 0, limit = 100, startTime = "", endTime = "" ) {
	await maybeCauseChaosAsync( "getAccountStatements" );

	return new Promise( ( resolve ) => {
		setTimeout( () => {
			const startDate = startTime ? new Date( startTime ) : new Date( 0 );
			const endDate = endTime ? new Date( endTime ) : new Date( 8640000000000000 );

			const statementsForAccount = ( accountStatements as Record<string, Array<{ statementDate: string }>> )[accountId] || [];
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

export async function getAccountStatementById( accountId: string, statementId: string ) {
	await maybeCauseChaosAsync( "getAccountStatementById" );

	return new Promise( ( resolve ) => {
		setTimeout( () => {
			const statementsForAccount = ( accountStatements as Record<string, Array<{ statementId: string }>> )[accountId] || [];
			const statement = statementsForAccount.find( ( s ) => s.statementId === statementId ) || null;
			resolve( statement );
		}, 50 );
	} );
}

export async function getAccountTransactions( accountId: string, offset = 0, limit = 100, startTime = "", endTime = "" ) {
	await maybeCauseChaosAsync( "getAccountTransactions" );

	return new Promise( ( resolve ) => {
		setTimeout( () => {
			const startDate = startTime ? new Date( startTime ) : new Date( 0 );
			const endDate = endTime ? new Date( endTime ) : new Date( 8640000000000000 );
			const transactionsForAccount = ( accountTransactions as Record<string, Array<{ postedTimestamp: string }>> )[accountId] || [];
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

export async function getPaymentNetworks( accountId: string, offset = 0, limit = 100 ) {
	await maybeCauseChaosAsync( "getPaymentNetworks" );

	return new Promise( ( resolve ) => {
		setTimeout( () => {
			const networks = ( accountPaymentNetworks as Record<string, unknown[]> )[accountId] || [];
			const paginated = networks.slice( offset, offset + limit );
			resolve( { paymentNetworks: paginated, total: networks.length } );
		}, 100 );
	} );
}

export async function getAssetTransferNetworks( accountId: string, offset = 0, limit = 100 ) {
	await maybeCauseChaosAsync( "getAssetTransferNetworks" );

	return new Promise( ( resolve ) => {
		setTimeout( () => {
			const networks = ( accountPaymentNetworks as Record<string, unknown[]> )[accountId] || [];
			const paginated = networks.slice( offset, offset + limit );
			resolve( { assetTransferNetworks: paginated, total: networks.length } );
		}, 100 );
	} );
}
