import { proxyActivities } from "@temporalio/workflow";
import type * as activities from "./activities.js";

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
		maximumAttempts: 10,
		nonRetryableErrorTypes: [ "NonRetryableError" ]
	}
} );

// Customer workflows
export async function getCurrentCustomerWorkflow(): Promise<unknown> {
	return await getCurrentCustomer();
}

export async function getCustomerByIdWorkflow( customerId: string ): Promise<unknown> {
	return await getCustomerById( customerId );
}

export async function getCustomersWorkflow( filters: { status?: string } = {} ): Promise<unknown> {
	return await getCustomers( filters );
}

// Account workflows
export async function getAccountsWorkflow( offset: number, limit: number ): Promise<unknown> {
	return await getAccounts( offset, limit );
}

export async function getAccountByIdWorkflow( accountId: string ): Promise<unknown> {
	return await getAccountById( accountId );
}

export async function getAccountContactByIdWorkflow( accountId: string ): Promise<unknown> {
	return await getAccountContactById( accountId );
}

export async function getAccountStatementsWorkflow(
	accountId: string,
	offset: number,
	limit: number,
	startTime: string,
	endTime: string
): Promise<unknown> {
	return await getAccountStatements( accountId, offset, limit, startTime, endTime );
}

export async function getAccountStatementByIdWorkflow( accountId: string, statementId: string ): Promise<unknown> {
	return await getAccountStatementById( accountId, statementId );
}

export async function getAccountTransactionsWorkflow(
	accountId: string,
	offset: number,
	limit: number,
	startTime: string,
	endTime: string
): Promise<unknown> {
	return await getAccountTransactions( accountId, offset, limit, startTime, endTime );
}

export async function getPaymentNetworksWorkflow( accountId: string, offset: number, limit: number ): Promise<unknown> {
	return await getPaymentNetworks( accountId, offset, limit );
}

export async function getAssetTransferNetworksWorkflow( accountId: string, offset: number, limit: number ): Promise<unknown> {
	return await getAssetTransferNetworks( accountId, offset, limit );
}
