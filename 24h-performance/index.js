const request = require('request');
const drivers = process.argv[2] || 10;
const eventSendingInterval = process.argv[3] || 1000;
const childProcess = require('child_process');
const OAUTH_URL = 'https://oauth.test.breakerlog.com/auth-provider/code?response_type=code&client_id=carm-rest&redirect_uri=https://api.test.breakerlog.com/carm/driver/v1/authorization';
const API_URL = 'https://api.test.breakerlog.com/carm/driver/v1/authorization?code=';
const PASSWORD = 'PvsybVtyt19';
const USER = 'perfdriver';
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const tokens = [];

const login = driverIndex => {
  return new Promise((resolve, reject) => {
    const token = new Buffer(`${USER}${driverIndex}:${PASSWORD}`).toString('base64');
    const reqOptions = {
      url: OAUTH_URL,
      headers: {
        authorization: `Basic ${token}`
      }
    };

    console.log('::LOGIN::START::', `${USER}${driverIndex}`, new Date());

    request(reqOptions, (err, resp) => {
      if (err || resp.statusCode >= 500) {
        return reject(err || {message: 'Bad response'});
      }
      request(`${API_URL}${resp.body}`, (error, resp) => {
        if (error || !resp || resp.statusCode >= 500) {
          return reject(error || {message: 'Bad response'});
        }

        console.log('::LOGIN::DONE::', `${USER}${driverIndex}`, new Date());

        resolve(JSON.parse(resp.body));
      });
    });
  });
};

function ex(gen) {
  var iterator = gen();

  function next(itNext) {
    if(itNext.done) {
      return;
    }
    itNext.value
      .then(result => next(iterator.next(result)))
      .catch(error => iterator.throw(error));
  }

  next(iterator.next());
}

ex(function* () {
  const start = Date.now();

  for (var i = 1; i < drivers; i++) {
    try {
      const result = yield login(i);

      tokens.push({
        token: result.token,
        driver: `${USER}${i}`
      });
    } catch (error) {
      console.log('::ERROR::', error.message || 'Unknown error', `::${USER}${i}`);
    }
  }

  console.log('::ALL DRIVERS SUCCESSFULLY LOGGED IN::', Date.now() - start, 'ms');

  const timer = setTimeout(() => runSockets(), 5000);

  rl.question('Do you want start web sockets testing? (Yes/no)', answer => {
    clearTimeout(timer);
    if (answer.toLowerCase() === 'yes' || !answer) {
      runSockets();
    } else {
      rl.close();
    }
  });
});

function runSockets() {
  tokens.forEach(item => {
    childProcess.fork(`./socket.js`, [item.token, item.driver, eventSendingInterval]);
  });
}
