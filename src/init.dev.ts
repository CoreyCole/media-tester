import * as bst from 'bespoken-tools';

const server = new bst.LambdaServer('./src/index', 10001, true);
server.start(() => console.log('[init.dev]: server started and listening on port 10001!'));
