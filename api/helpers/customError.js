'use strict';

/** CustomError assigns @customArgs.code to instances. */
class CustomError extends Error {
    /**
     * 
     * @param {Object} customArgs - Custom args.
     * @param {number} customArgs.code - Error code.
     * @param {...*} args - Normal Error args.
     */
    constructor(customArgs, ...args) {
        super(...args);

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        }

        this.code = customArgs.code;
    }
}

module.exports = CustomError;
