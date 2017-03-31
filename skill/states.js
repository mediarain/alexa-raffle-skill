'use strict';
const _ = require('lodash');
const UserStorage = require('../services/userStorage');
const storage = new UserStorage();
const prizes = [
  'eco', 
  'dot',
  'shirt'
];

exports.register = function register(skill) {

  skill.onRequestStarted((alexaEvent) => {
    return storage.get('1')
    .then((raffle) => {
      alexaEvent.model.raffle = raffle;
      return alexaEvent;
    });

  });

  skill.onError((alexaEvent, error) => {
    console.log('onError %s', error);
    console.log(error.stack);
    return new Reply(alexaEvent, { tell: error });
  }, true);

  skill.onIntent('LaunchIntent', () => ({ reply: 'Intent.Launch', to: 'optionsReview'  }));

  skill.onState('optionsReview', (alexaEvent) => {
    const intent = _.get(alexaEvent,'intent.name');
    if(intent == 'AMAZON.YesIntent'){
        return { reply: 'Intent.Raffle', to: 'entry' };
    }
    else if(intent == 'AMAZON.NoIntent'){
      return { reply: 'Intent.Exit', to: 'die' };
    }

  });

  skill.onIntent('PrizeIntent', (alexaEvent) => {
    let prize = alexaEvent.intent.params.prize;
    alexaEvent.model.prize = prize;

    if(_.includes(prizes,prize)){
      let prizeStock = _.get(alexaEvent, `model.raffle.${prize}`);
      if(prizeStock > 0){
        //get winner
        let participants = alexaEvent.model.raffle.participants,
            winners = alexaEvent.model.raffle.winners,
            newArr = _.difference(participants,winners);


        if(_.isEmpty(newArr)){
            _.set(alexaEvent, `model.raffle.winners`, []);
            winners = alexaEvent.model.raffle.winners,
            newArr = _.difference(participants,winners);

        }
        let winner = _.sample(newArr);

        //set winner
        winners.push(winner);
        _.set(alexaEvent, `model.raffle.winners`, winners);

        //update number
        console.log('prize',alexaEvent.model.raffle.shirt);
        _.set(alexaEvent, `model.raffle.${prize}`, prizeStock-1);
        console.log('prize 2 ', alexaEvent.model.raffle.shirt);

        //update in table
        return storage.put(alexaEvent.model.raffle)
          .then((raffle) => {
            alexaEvent.model.winner = winner;
            return { reply: 'Intent.Winner', to: 'die' };  
          })
          .catch((err) =>{
              console.log(err);
              return { reply: 'Intent.Error', to: 'die' }
          });
      }
      return { reply: 'Intent.OutOfStock', to: 'entry' };  
    }

    return { reply: 'Intent.WrongPrize', to: 'entry' };
  });

  skill.onIntent('AMAZON.CancelIntent', () => ({ reply: 'Intent.Exit' }));
  skill.onIntent('AMAZON.StopIntent', () => ({ reply: 'Intent.Exit' }));
  skill.onIntent('AMAZON.HelpIntent', () => ({ reply: 'Intent.Help', to: 'entry' }));
};
