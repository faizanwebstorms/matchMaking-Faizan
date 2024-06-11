const { model } = require('mongoose');

module.exports.Token = require('./token.model');
module.exports.User = require('./user.model');
module.exports.QuestionnaireResponse = require('./questionnairResponse.model');
module.exports.UserPreference = require('./userPreference.model');
module.exports.Reaction = require ('./reaction.model');
module.exports.Chat = require ('./chat');