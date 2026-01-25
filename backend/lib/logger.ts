import pino from "pino";
import pretty from "pino-pretty";

// pino-pretty must only be used in development
const pinoPretty = process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'test'
    ? pretty({colorize: true})
    : undefined;
export const logger = pino(pinoPretty);