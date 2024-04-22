/**
 * Logger -- Centralized message logging class
 */
module.exports = class Logger {
  // Describes verbosity of messages to log, where higher verbosity means more messages
  static VERBOSE = 0;

  // Logs the specified message under the given verbosity.
  static log(verbosity, msg){
    if(verbosity <= Logger.VERBOSE){  // Only print if verbosity meets criteria
      console.log(msg);
    }
  }
}