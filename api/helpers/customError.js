'use strict';

class CustomError extends Error {
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
