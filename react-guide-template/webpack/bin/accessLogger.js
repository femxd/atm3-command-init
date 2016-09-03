import morgan from 'morgan';

export default function accessLogger() {
  morgan.token('date', (req, res) => {
    let current = new Date();
    return `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`;
  });
  morgan.token('remote-addr', (req, res) => {
    return req.get('x-forwarded-for') || req.ip;
  });
  morgan.token('sn', (request) => {
    return request.sn || 'sn';
  });

  morgan.token('user', (request) => {
    return (request.session && request.session.cas && request.session.cas.user) ? request.session.cas.user : (request.cookies.vc || 'unknown');
  });
  const _morgan = morgan(':remote-addr|:sn|:user|:method|:url|:status|:response-time| - ":referrer" - ":user-agent"');

  return (req, res, next) => {

    const getUser = () => {
      return (req.session && req.session.cas && req.session.cas.user) || (req.cookies && req.cookies.vc) || 'unknown';
    }

    function getLogger(type = 'log', ...args) {
      if (!console[type]) {
        console.error('invalid console type', type);
      }

      return console[type].bind(console[type], `${req.ip}|${req.sn}|${getUser()}|`, ...args);
    }


    req.getLogger = getLogger;

    req.log = {
      debug: __DEVELOPMENT__ ? getLogger('log') : () => { },
      info: getLogger('log'),
      log: getLogger('log'),
      warn: getLogger('warn'),
      error: getLogger('error'),
      access: getLogger("info").bind(null, `${req.ip}|${req.sn}|${getUser()}`)
    };

    return _morgan(req, res, next);
  }
}
