const { validationResult } = require('express-validator');


let ErrorValidation = (req, res) => {
  const errorFormatter = ({msg}) => {
  return {errorMessage:`${msg}`};
  }   
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return false;
  } else {
    return true;
  }
}
module.exports = { ErrorValidation }

    