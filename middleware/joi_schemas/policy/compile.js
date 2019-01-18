var schema = {};
module.exports = schema;

const Joi = require('joi');
const sharedSch = require('../shared');
 
schema.validate = req => {
  return new Promise(async (resolve, reject) => {
    var schema = Joi.object().keys({ 
      fwcloud: sharedSch.id,
      firewall: sharedSch.id
     });
    
    if (req.method==='PUT') {
      if (req.url==='/policy/compile')
        schema = schema.append({ socketid: sharedSch.socketio_id.optional() });
      else if (req.url==='/policy/compile/rule')
        schema = schema.append({ type: sharedSch.policy_type, rule: sharedSch.id });
      else return reject(new Error('Request URL not accepted'));
    } else return reject(new Error('Request method not accepted'));

    try {
      await Joi.validate(req.body, schema, sharedSch.joiValidationOptions);
      resolve();
    } catch(error) { return reject(error) } 
  });
};