/**
 * @typedef {import('express').Request} ExpressRequest
 * @typedef {import('express').Response} ExpressResponse
 * @typedef {import('express').NextFunction} ExpressNext
 */

/**
 * @typedef {ExpressRequest & {
* tracking_id?: string
* headers?: Record<string,any>
* user?: {}
* files?: []
* }} OurRequest
*/
