const moment = require('moment');
const localTime = new Date();
function formatMessage(username, text){
  return {
    username,
    text,
    time:localTime
  }
}

module.exports = formatMessage;