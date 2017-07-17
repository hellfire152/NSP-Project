var helmet = require('helmet');

var ninetyDaysInSeconds = 7776000;
app.use(helmet.hpkp({
  maxAge: ninetyDaysInSeconds,
  sha256s: ['AbCdEf123=', 'ZyXwVu456=']
}));
