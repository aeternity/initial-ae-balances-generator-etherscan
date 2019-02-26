const Web3 = require('web3')
const BN = Web3.utils.BN;
const web3 = new Web3()
const axios = require('axios')
const fs = require('fs')
const args = require('minimist')(process.argv.slice(2));

// Phase 0
//const url1 = 'https://etherscan.io/tx/0xb9aa18432655e78cda82320d419f4a0ef67863855a314fb766eb2ddbdda96dc9';
//const url2 = 'https://etherscan.io/tx/0x6dd35f57ac61436c9ee7ebc2cd0be830506965aca072eb23dc0e4e4b6456cbfb';
//const fromBlock = 6682073;
//const toBlock   = 6772802

// Phase 1
const url1 = 'https://etherscan.io/tx/0x6dd35f57ac61436c9ee7ebc2cd0be830506965aca072eb23dc0e4e4b6456cbfb';
const url2 = 'https://etherscan.io/tx/0xed2415a9e8026e042c58e701bfbe218f858ad71bfa9796c9b8936b8faae83155';
const fromBlock = 6772803; // included
const toBlock   = 7225342 // included

const apiKey = args.k;

if (apiKey  == null) {
	console.log('Please specify etherscan.io api key.')
	console.log('Register for free at https://etherscan.io/register to get an api key.')
	console.log('run with: "node initial-balances-generator-etherscan.js -k YOURPERSONALAPIKEY"');
	process.exit(1);
}
console.log(
	`Getting Logs for phase 1 from block ${fromBlock} to ${toBlock}`,
	`\nCheck the following urls for 'from' and 'to' block:`,
	`\n end of phase 0`,
	`\n\t ${url1}`,
	`\n\n end of token migration phase 1:`,
	`\n\t${url2}\n`
)

const address = '0x8a3B7094e1D80C8366B4687cB85862311C931C52'
const topic = '0x750a9579a45dea376a35c93ce214a7a9a46af18fb438069f8f734ab75891afb0'
const abi = [
	{
		"indexed": true,
		"name": "from",
		"type": "address"
	},
	{
		"indexed": false,
		"name": "pubkey",
		"type": "bytes"
	},
	{
		"indexed": false,
		"name": "value",
		"type": "uint256"
	},
	{
		"indexed": false,
		"name": "count",
		"type": "uint256"
	},
	{
		"indexed": true,
		"name": "deliveryPeriod",
		"type": "uint16"
	}
]

var start = fromBlock;
var pageSize = 10000; // reduce if results truncated by etherscan

var end = start + (pageSize - 1);
(async function() {
	let collected = []
	while(start <= toBlock) {
		var end_in_range = Math.min(end, toBlock)
		console.log(`Getting Logs from block ${start} to ${end_in_range}. Please wait...`)
		// HTTP API includes fromBlock and includes toBlock.
		let url = `https://api.etherscan.io/api?module=logs&action=getLogs&fromBlock=${
			start
		}&toBlock=${
			end_in_range
		}&address=${
			address
		}&topic0=&apikey=${
			apiKey
		}`
		let resp = await axios.get(url)
		console.assert(resp.data.status === "0" || resp.data.status === "1", "Bad status in response: %s (%s). Url: %s", resp.data.status, resp.data.message, url) // 0 = No records found, 1 = OK.
		let results = resp.data.result
		console.assert(results.length < 1000, "Potentially truncated results (%d). Url %s", results.length, url) // From https://etherscan.io/apis#logs : "For performance & security considerations, only the first 1000 results are return. So please narrow down the filter parameters"
		results = results
			.map(r => web3.eth.abi.decodeLog(
				abi,
				r.data,
				[r.topics[1], r.topics[2]]
			))
		collected = collected.concat(results)
		start = 1 + end
		end = start + (pageSize - 1)
	}
	let json = {}
	collected.forEach(e => {
		let address = web3.utils.toAscii(e.pubkey);
		address = address.replace(/(\r\n\t|\n|\r\t)/gm,"");
		if(json[address]) {
			json[address] = new BN(e.value).add(new BN(json[address])).toString()
		} else {
			json[address] = e.value
		}
	})
  let jsonString = JSON.stringify(json, Object.keys(json).sort(), 2)
	jsonString = jsonString.replace(/: "/gm, ': ')
	jsonString = jsonString.replace(/",$/gm, ',')
	jsonString = jsonString.replace(/"$/gm, '')
	fs.writeFileSync("./accounts.json", jsonString+'\n') ;
	fs.writeFileSync("./collected_logs.json", JSON.stringify(collected)+'\n') ;

  let final = Object
    .values(json)
    .map(v => new BN(v))
    .reduce((a, c) => a.add(c), new BN())
	final = Web3.utils.fromWei(final).toString()


	console.log(`Processed ${collected.length} events with ${Object.keys(json).length} individual aeternity accounts`)
	console.log(`Collected ${final} AE Tokens in this phase`)
	console.log('\n./accounts.json written to disk')
	console.log('\n./collected_logs.json written to disk')
	console.log('verify sha256 hash of accounts json with this command:')
	console.log('\t$ shasum -a 256 accounts.json')
})()
