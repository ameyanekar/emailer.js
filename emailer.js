const https = require('https');
const fs = require('fs');
const argv = require('yargs').argv;
require('dotenv').config();

let usage = () => {
	console.log(
		'node emailer.js <recipient@email.com> <recepient-name> <Subject> <[-t text] [-f filepath]> '
	);
};

if (argv.h || argv.help) {
	usage();
	process.exit();
}

let recepientEmail = argv._[0];
let recepientName = argv._[1];
let emailSubject = argv._[2];
let file = argv.f;

if (argv._.length < 3) {
	usage();
	process.exit();
}

let text;

if (file) {
	if (!fs.existsSync(file)) {
		console.error(`${file} does not exist!`);
		usage();
		process.exit();
	}
	text = fs.readFileSync(file).toString().replace(/http/g, 'hxxp');
} else if (argv.t) {
	text = argv.t.replace(/http/g, 'hxxp');
} else {
	console.error(`Either provide file or text to send over email!`);
	usage();
	process.exit();
}

let requestOptions = {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${process.env.sendgrid_apikey}`,
	},
};

let postData = {
	personalizations: [
		{
			to: [{ email: recepientEmail, name: recepientName }],
			subject: emailSubject,
		},
	],
	from: { email: 'notifier@techkranti.com', name: 'Ameys Notifier' },
	content: [{ type: 'text/plain', value: text }],
};

let request = https.request(
	'https://api.sendgrid.com/v3/mail/send',
	requestOptions,
	(response) => {
		responseText = '';

		response.on('data', (chunk) => {
			responseText += chunk;
		});

		if (response.statusCode < 200 || response.statusCode > 300) {
			console.error('Something went wrong:', responseText);
			console.error('Something went wrong:', response.statusCode);
		}
	}
);

request.write(JSON.stringify(postData));
request.end();
