import { Client, Connection } from "@temporalio/client";
import { logger } from "@apps/shared";
import { TASK_QUEUE } from "./worker.js";
import { v4 as uuidv4 } from "uuid";

let client: Client | null = null;

export async function getTemporalClient(): Promise<Client> {
	if ( !client ) {
		const connection = await Connection.connect( {
			address: process.env.TEMPORAL_ADDRESS || "localhost:7233"
		} );

		client = new Client( {
			connection,
			namespace: process.env.TEMPORAL_NAMESPACE || "default"
		} );

		logger.info( "Temporal client connected" );
	}

	return client;
}

export async function executeWorkflow<T>(
	workflowName: string,
	args: unknown[] = []
): Promise<T> {
	const temporalClient = await getTemporalClient();

	const handle = await temporalClient.workflow.start( workflowName, {
		taskQueue: TASK_QUEUE,
		workflowId: `${ workflowName }-${ uuidv4() }`,
		args
	} );

	return await handle.result() as T;
}

// Convenience functions for each workflow
export async function fetchCurrentCustomer() {
	return executeWorkflow( "getCurrentCustomerWorkflow" );
}

export async function fetchCustomerById( customerId: string ) {
	return executeWorkflow( "getCustomerByIdWorkflow", [ customerId ] );
}

export async function fetchCustomers( filters: { status?: string } = {} ) {
	return executeWorkflow( "getCustomersWorkflow", [ filters ] );
}

export async function fetchAccounts( offset: number, limit: number ) {
	return executeWorkflow( "getAccountsWorkflow", [ offset, limit ] );
}

export async function fetchAccountById( accountId: string ) {
	return executeWorkflow( "getAccountByIdWorkflow", [ accountId ] );
}

export async function fetchAccountContactById( accountId: string ) {
	return executeWorkflow( "getAccountContactByIdWorkflow", [ accountId ] );
}

export async function fetchAccountStatements(
	accountId: string,
	offset: number,
	limit: number,
	startTime: string,
	endTime: string
) {
	return executeWorkflow( "getAccountStatementsWorkflow", [ accountId, offset, limit, startTime, endTime ] );
}

export async function fetchAccountStatementById( accountId: string, statementId: string ) {
	return executeWorkflow( "getAccountStatementByIdWorkflow", [ accountId, statementId ] );
}

export async function fetchAccountTransactions(
	accountId: string,
	offset: number,
	limit: number,
	startTime: string,
	endTime: string
) {
	return executeWorkflow( "getAccountTransactionsWorkflow", [ accountId, offset, limit, startTime, endTime ] );
}

export async function fetchPaymentNetworks( accountId: string, offset: number, limit: number ) {
	return executeWorkflow( "getPaymentNetworksWorkflow", [ accountId, offset, limit ] );
}

export async function fetchAssetTransferNetworks( accountId: string, offset: number, limit: number ) {
	return executeWorkflow( "getAssetTransferNetworksWorkflow", [ accountId, offset, limit ] );
}
