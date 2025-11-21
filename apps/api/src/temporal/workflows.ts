import { proxyActivities } from "@temporalio/workflow";
import type * as activities from "./activities.js";
import type {
	Customer,
	Account,
	AccountContact,
	Statement,
	PaginatedAccountsResult,
	PaginatedStatementsResult,
	PaginatedTransactionsResult,
	PaginatedPaymentNetworksResult,
	PaginatedAssetTransferNetworksResult
} from "./activities.js";

// Configure activities with retry policy for chaos errors
const {
	getCurrentCustomer,
	getCustomerById,
	getCustomers,
	getAccounts,
	getAccountById,
	getAccountContactById,
	getAccountStatements,
	getAccountStatementById,
	getAccountTransactions,
	getPaymentNetworks,
	getAssetTransferNetworks
} = proxyActivities<typeof activities>( {
	startToCloseTimeout: "30s",
	retry: {
		initialInterval: "500ms",
		backoffCoefficient: 2,
		maximumInterval: "5s",
		maximumAttempts: 10
	}
} );

// Customer workflows
export async function getCurrentCustomerWorkflow(): Promise<Customer | null> {
	return await getCurrentCustomer();
}

export async function getCustomerByIdWorkflow( customerId: string ): Promise<Customer | null> {
	return await getCustomerById( customerId );
}

export async function getCustomersWorkflow( filters: { status?: string } = {} ): Promise<Customer[]> {
	return await getCustomers( filters );
}

// Account workflows
export async function getAccountsWorkflow( offset: number, limit: number ): Promise<PaginatedAccountsResult> {
	return await getAccounts( offset, limit );
}

export async function getAccountByIdWorkflow( accountId: string ): Promise<Account | null> {
	return await getAccountById( accountId );
}

export async function getAccountContactByIdWorkflow( accountId: string ): Promise<AccountContact | null> {
	return await getAccountContactById( accountId );
}

export async function getAccountStatementsWorkflow(
	accountId: string,
	offset: number,
	limit: number,
	startTime: string,
	endTime: string
): Promise<PaginatedStatementsResult> {
	return await getAccountStatements( accountId, offset, limit, startTime, endTime );
}

export async function getAccountStatementByIdWorkflow( accountId: string, statementId: string ): Promise<Statement | null> {
	return await getAccountStatementById( accountId, statementId );
}

export async function getAccountTransactionsWorkflow(
	accountId: string,
	offset: number,
	limit: number,
	startTime: string,
	endTime: string
): Promise<PaginatedTransactionsResult> {
	return await getAccountTransactions( accountId, offset, limit, startTime, endTime );
}

export async function getPaymentNetworksWorkflow( accountId: string, offset: number, limit: number ): Promise<PaginatedPaymentNetworksResult> {
	return await getPaymentNetworks( accountId, offset, limit );
}

export async function getAssetTransferNetworksWorkflow( accountId: string, offset: number, limit: number ): Promise<PaginatedAssetTransferNetworksResult> {
	return await getAssetTransferNetworks( accountId, offset, limit );
}
