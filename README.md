### emailer.js
Send Email Using SendGrid API

### Clone Repo
git clone https://github.com/ameyanekar/emailer.js.git

cd emailer.js

### Install Dependencies
npm install

### Configure SendGrid API key
Create a .env file in the project root directory with the following content (Replace XXXXX with SendGrid API Key):

sendgrid_apikey=XXXXX

### Run:
node emailer.js <recipient@email.com> <recepient-name> <Subject> [-t text] [-f filepath] [-from sender@email.com]
