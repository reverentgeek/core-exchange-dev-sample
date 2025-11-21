import { Worker, NativeConnection } from "@temporalio/worker";
import * as activities from "./activities.js";
import { logger } from "@apps/shared";
import "dotenv/config";

export const TASK_QUEUE = "api-tasks";

async function run() {
	const connection = await NativeConnection.connect( {
		address: process.env.TEMPORAL_ADDRESS || "localhost:7233"
	} );

	const worker = await Worker.create( {
		connection,
		namespace: process.env.TEMPORAL_NAMESPACE || "default",
		taskQueue: TASK_QUEUE,
		workflowsPath: new URL( "./workflows.ts", import.meta.url ).pathname,
		activities
	} );

	logger.info( { taskQueue: TASK_QUEUE }, "Temporal worker started" );

	await worker.run();
}

run().catch( ( err ) => {
	logger.error( { err }, "Temporal worker failed" );
	process.exit( 1 );
} );
