import { logger } from "@apps/shared";
import { ApplicationFailure } from "@temporalio/activity";

// Error types that can be randomly generated
export enum ChaosErrorType {
	/* eslint-disable no-unused-vars */
	DATABASE_CONNECTION = "DATABASE_CONNECTION",
	DATABASE_TIMEOUT = "DATABASE_TIMEOUT",
	DATABASE_DEADLOCK = "DATABASE_DEADLOCK",
	NETWORK_TIMEOUT = "NETWORK_TIMEOUT",
	NETWORK_CONNECTION_REFUSED = "NETWORK_CONNECTION_REFUSED",
	SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
	INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
	RESOURCE_EXHAUSTED = "RESOURCE_EXHAUSTED",
	NON_RETRYABLE_ERROR = "NON_RETRYABLE_ERROR"
	/* eslint-enable no-unused-vars */
}

// Custom error class for chaos-generated errors
export class ChaosError extends Error {
	public readonly errorType: ChaosErrorType;
	public readonly statusCode: number;
	public readonly retryable: boolean;

	constructor( errorType: ChaosErrorType, message: string, statusCode: number, retryable: boolean ) {
		super( message );
		// Use errorType as name so Temporal can match nonRetryableErrorTypes
		this.name = errorType;
		this.errorType = errorType;
		this.statusCode = statusCode;
		this.retryable = retryable;
	}
}

// Error configurations with realistic messages and status codes
const errorConfigs: Record<ChaosErrorType, { message: string; statusCode: number; retryable: boolean }> = {
	[ChaosErrorType.DATABASE_CONNECTION]: {
		message: "Failed to connect to database: connection refused",
		statusCode: 503,
		retryable: true
	},
	[ChaosErrorType.DATABASE_TIMEOUT]: {
		message: "Database query timed out after 30000ms",
		statusCode: 504,
		retryable: true
	},
	[ChaosErrorType.DATABASE_DEADLOCK]: {
		message: "Transaction deadlock detected, please retry",
		statusCode: 503,
		retryable: true
	},
	[ChaosErrorType.NETWORK_TIMEOUT]: {
		message: "Network request timed out",
		statusCode: 504,
		retryable: true
	},
	[ChaosErrorType.NETWORK_CONNECTION_REFUSED]: {
		message: "Connection refused: upstream service unavailable",
		statusCode: 502,
		retryable: true
	},
	[ChaosErrorType.SERVICE_UNAVAILABLE]: {
		message: "Service temporarily unavailable due to high load",
		statusCode: 503,
		retryable: true
	},
	[ChaosErrorType.INTERNAL_SERVER_ERROR]: {
		message: "An unexpected internal error occurred",
		statusCode: 500,
		retryable: false
	},
	[ChaosErrorType.RESOURCE_EXHAUSTED]: {
		message: "Resource exhausted: too many open connections",
		statusCode: 503,
		retryable: true
	},
	[ChaosErrorType.NON_RETRYABLE_ERROR]: {
		message: "A non-retryable error occurred",
		statusCode: 500,
		retryable: false
	}
};

// Configuration interface
interface ChaosConfig {
	enabled: boolean;
	errorRate: number; // 0-1, probability of error occurring
	enabledErrorTypes: ChaosErrorType[];
}

// Parse enabled error types from environment
function parseEnabledErrorTypes(): ChaosErrorType[] {
	const envTypes = process.env.CHAOS_ERROR_TYPES;
	if ( !envTypes ) {
		return Object.values( ChaosErrorType );
	}

	const types = envTypes.split( "," ).map( t => t.trim().toUpperCase() );
	return types.filter( t => Object.values( ChaosErrorType ).includes( t as ChaosErrorType ) ) as ChaosErrorType[];
}

// Get current configuration
function getConfig(): ChaosConfig {
	return {
		enabled: process.env.CHAOS_ENABLED === "true",
		errorRate: parseFloat( process.env.CHAOS_ERROR_RATE || "0.1" ),
		enabledErrorTypes: parseEnabledErrorTypes()
	};
}

// Main chaos function - call this before/during operations
export function maybeCauseChaos( operationName: string ): void {
	const config = getConfig();

	if ( !config.enabled ) {
		return;
	}

	// Check if we should trigger an error based on error rate
	if ( Math.random() > config.errorRate ) {
		return;
	}

	// Select a random error type from enabled types
	const errorType = config.enabledErrorTypes[Math.floor( Math.random() * config.enabledErrorTypes.length )];
	const errorConfig = errorConfigs[errorType];

	logger.warn( {
		chaos: true,
		operation: operationName,
		errorType,
		message: errorConfig.message
	}, `Chaos monkey triggered: ${ errorType }` );

	// Use Temporal's ApplicationFailure for proper retry handling
	if ( !errorConfig.retryable ) {
		throw ApplicationFailure.nonRetryable( errorConfig.message, errorType );
	}

	throw ApplicationFailure.retryable( errorConfig.message, errorType );
}

// Async version that can also add random delays
export async function maybeCauseChaosAsync( operationName: string ): Promise<void> {
	const config = getConfig();

	if ( !config.enabled ) {
		return;
	}

	// Optionally add random latency (0-500ms extra)
	if ( process.env.CHAOS_ADD_LATENCY === "true" && Math.random() < 0.3 ) {
		const extraLatency = Math.floor( Math.random() * 500 );
		logger.debug( { chaos: true, operation: operationName, extraLatency }, "Chaos monkey adding latency" );
		await new Promise( resolve => setTimeout( resolve, extraLatency ) );
	}

	maybeCauseChaos( operationName );
}

// Log chaos configuration on startup
export function logChaosConfig(): void {
	const config = getConfig();

	if ( config.enabled ) {
		logger.info( {
			chaos: true,
			enabled: config.enabled,
			errorRate: `${ ( config.errorRate * 100 ).toFixed( 1 ) }%`,
			enabledErrorTypes: config.enabledErrorTypes,
			addLatency: process.env.CHAOS_ADD_LATENCY === "true"
		}, "Chaos monkey is ENABLED" );
	} else {
		logger.debug( { chaos: true, enabled: false }, "Chaos monkey is disabled" );
	}
}

export { ChaosConfig };
