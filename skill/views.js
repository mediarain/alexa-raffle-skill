'use strict';

const authCard = { type: 'LinkAccount' };
const responses = (function responses() {
  return {
    Intent: {
      Launch: {
        ask: 'Welcome to the raffle skill by Rain agency. Do you want to start the raffle?',
        reprompt: 'Do you want to start the raffle?'
      },
      Raffle : {
        ask: 'Which prize do you want to raffle? A shirt, an echo or a dot?',
        reprompt: 'Which prize do you want to raffle? A shirt, an echo or a dot?'
      },
      WrongPrize : {
        ask: 'Sorry, the prize you said is not listed in the raffle skill, please try again.',
        reprompt: 'Please try again.'
      },
      Winner : {
        tell: 'The winner of the {prize} is {winner}. Congratulations!'
      },
      OutOfStock: {
        ask: 'Sorry, i don\'t have another {prize} in stock anymore. Please try with another prize.',
        reprompt: 'Please try with another prize.'
      },
      Error: {
        tell: 'Sorry, an error occurred. Please try again later'
      },
      Help: {
        ask: 'You can ask me for a prize and i will tell you the winner, which prize would you like to ruffle?',
        reprompt: 'Which prize would you like to ruffle?'
      },
      Exit: {
        tell: 'Thanks for playing.'
      }
    }
  };
}());
module.exports = responses;
