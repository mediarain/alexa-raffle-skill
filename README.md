# Raffle Skill using Voxa 

### Development Setup

* `git clone` this repository
* Install and use Node v6.10.0
* Run `npm install`
* Edit `config/local.json` with all of the requisite fields.

`npm run watch` will start the server and watch for changes.


### Directory Structure

	`config/` -> Environment variables or configuration
	`services/` -> API clients, Authentications and Extras
	`skill/` -> Amazon Echo Skill login, the state machine and flow
	`speechAssets/` -> Amazon Echo Utterances, Intent Schema and Custom Slots.
	`tests/` -> Unit Tests
	`www/` -> Public site, expose for authentication.
	`gulpfile.js` -> Gulp tasks
	`package.json` -> Dependencies
	`README.md`


### Database structure

This example is hosted in a DynamoDB table which follows the next structure:

	`id` -> Default id for every row (Number)
	`dot` -> Quantity for the dot prize (Number)
	`eco` -> Quantity for the Echo prize (Number)
	`shirt` -> Quantity for the shirt prize (Number)
	`participants` -> List of people who will participate in the raffle (List)
	`winners` -> List of people who have already won a prize (List)


The `winners` field also works to exclude people from next raffles so the same person does not win more than once.