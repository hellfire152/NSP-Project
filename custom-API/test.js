var cipher = require("./cipher.js")();

cipher.decrypt("b0e3f1ed2251024bc45262aebdb9df6f8fdeb906ef13895596af602ef6c928e8")
.this(out => {
  console.log(out);
});
