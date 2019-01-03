// Copyright 2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Import the Dialogflow module and response creation dependencies from the 
// Actions on Google client library.
import {
    dialogflow,
    MediaObject,
    Suggestions
} from 'actions-on-google';

// Instantiate the Dialogflow client.
const app = dialogflow({ debug: true });

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('LaunchRequest', (conv) => {
    console.log('[LaunchRequest]');
    conv.ask(`Welcome! Starting the audio loop...`);
    conv.ask(new MediaObject({
        name: 'piano file loop',
        description: 'testing auto play',
        url: 'https://s3-us-west-2.amazonaws.com/hallooinc/audio/harmony-silent-file_v2.mp3'
    }));
    conv.ask(new Suggestions('cancel'));
});

app.intent('MediaStatus', (conv) => {
    console.log('[MediaStatus]');
    conv.ask(`Continue the audio loop...`);
    conv.ask(new MediaObject({
        name: 'piano file loop',
        description: 'testing auto play',
        url: 'https://s3-us-west-2.amazonaws.com/hallooinc/audio/harmony-silent-file_v2.mp3'
    }));
    conv.ask(new Suggestions('cancel'));
});

app.intent('CancelIntent', (conv) => {
    console.log('[CancelIntent');
    conv.close('OK. Goodbye!');
});

export const handler = (event: any, context: any, callback: (err: any, response: any) => void): void => {
    console.log('event', event);
    console.dir('context', context);
    app.handler(event, {})
        .then((res) => {
            if (res.status != 200) {
                callback(null, { 'fulfillmentText': `I got status code: ${res.status}` });
            } else {
                callback(null, res.body);
            }
        }).catch((e) => {
            callback(null, { 'fulfillmentText': `There was an error\n${e}` });
        });
};
