'use strict';

const expect = require('chai').expect;

const CustomError = require('../../../api/helpers/customError');

describe('CustomError', () => {
    it('sets code', () => {
        const err = new CustomError({ code: 404 });

        expect(err.code).to.eql(404);
    });
});
