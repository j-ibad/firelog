import {APP_CONF} from '../utils/Config';


/**
 * Logger -- Centralized message logging class
 */
export default class Logger {
  // Describes verbosity of messages to log, where higher verbosity means more messages
  static VERBOSE: number = APP_CONF?.server?.verbose || 0;

  // Logs the specified message under the given verbosity.
  static log(verbosity: number, msg: string){
    if(verbosity <= Logger.VERBOSE){  // Only print if verbosity meets criteria
      console.log(msg);
    }
  }
}