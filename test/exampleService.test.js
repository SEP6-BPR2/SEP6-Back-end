require('dotenv').config(); // Initialize env
process.env.GCPDBUSER = "testing";

const exampleModel = require('../models/exampleModel');
const exampleService = require('../services/exampleService');
const sinon = require('sinon');

let assert = require('assert');

describe("Example service testing", () => {

    afterEach(function () {
        sinon.restore();
    });

    it("getExampleData", async () => {
        sinon.stub(exampleModel, "getExampleData").returns("test worked");

        const data = await exampleService.getExample();

        assert.equal(data, "test worked")
    });
})