const exampleModel = require('../models/exampleModel');

module.exports.getExample = async () => {
    return await exampleModel.getExampleData();
}