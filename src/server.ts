import 'core-js/stable';
import 'regenerator-runtime/runtime';
import express, { json } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { config } from 'dotenv';
import appUiMiddleware from '@src/Middleware/appUiMiddleware';
import fetchHealthEndpoint from '@endpoints/Health/fetchHealthEndpoint';
import fetchSetupEndpoint from '@endpoints/Setup/fetchSetupEndpoint';
import sendToIndexMiddleware from '@src/Middleware/sendToIndexMiddleware';

// ENV VARS
config();

// @TODO update this with an actual logger such as splunk
// const logger = console;
const logger = {
    info: (...args: any) => {},
    error: (...args: any) => {},
    log: (...args: any) => {},
};
// Create a new express instance
const server = express();
// Setting up middlewares
server.use(json());
server.use(helmet({ contentSecurityPolicy: false }));
server.use(cors({ origin: '*' }));
server.use(compression());
// SERVE STATIC ASSETS
// Expose the built app ui assets
// We run string replace to populate the app UI with variables to load the micro UI
server.use(appUiMiddleware(process.env), express.static('.assets'));
// Setup Endpoint
// This endpoint will provide the application with the required environment vars
// This is not embedded due to CSP which is a good thign
server.get('/static/setup.js', fetchSetupEndpoint(process.env));
// Health endpoint
// This is required for kube to know the service is up and running
// We will attach this directly to the express instance as we don't want prefixes to impact
server.get('/health', fetchHealthEndpoint);
// Any non matched paths can be passed to the frontend
server.use('/static', express.static('.assets'));
// Handle index requests directly
server.get('*', appUiMiddleware(process.env), sendToIndexMiddleware);
// Start the server listening on the provided port
server.listen(process.env.APP_PORT || '8000');
// Log that something happened
logger.info('server started up and listening', process.env.SERVER_PORT || '8000');