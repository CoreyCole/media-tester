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
    Permission,
    Suggestions,
    BasicCard,
    Image,
    List
} from 'actions-on-google';

// Instantiate the Dialogflow client.
const app = dialogflow({ debug: true });

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', (conv) => {
    const name = (conv.user.storage as any).userName;
    console.log(`[Default Welcome Intent]: name: ${(conv.user.storage as any).userName}`);
    if (!name) {
        // Asks the user's permission to know their name, for personalization.
        conv.ask(new Permission({
            context: 'Hi there, to get to know you better',
            permissions: 'NAME',
        }));
    } else {
        conv.ask(`Hi again, ${name}. What's your favorite color?`);
    }
});

// Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
    if (!permissionGranted) {
        conv.ask(`Ok, no worries. What's your favorite color?`);
        conv.add(new Suggestions('Blue', 'Red', 'Green'));
    } else {
        (conv.user.storage as any).userName = conv.user.name.display;
        console.log(`[actions_intent_PERMISSION]: name: ${(conv.user.storage as any).userName}`);
        conv.ask(`Thanks, ${(conv.user.storage as any).userName}. What's your favorite color?`);
        conv.add(new Suggestions('Blue', 'Red', 'Green'));
    }
});

// Handle the Dialogflow NO_INPUT intent.
// Triggered when the user doesn't provide input to the Action
app.intent('actions_intent_NO_INPUT', (conv) => {
    // Use the number of reprompts to vary response
    const repromptCount = parseInt(conv.arguments.get('REPROMPT_COUNT') as string);
    if (repromptCount === 0) {
        conv.ask('Which color would you like to hear about?');
    } else if (repromptCount === 1) {
        conv.ask('Please say the name of a color.');
    } else if (conv.arguments.get('IS_FINAL_REPROMPT')) {
        conv.close('Sorry we\'re having trouble. Let\'s try this again later. Goodbye.');
    }
});

// Handle the Dialogflow CANCEL intent.
// Triggered when the user utters exit, cancel, stop, nevermind, goodbye
app.intent('actions_intent_CANCEL', (conv) => {
    conv.close('Let me know when you want to talk about colors again!');
});

// Define a mapping of fake color strings to basic card objects.
const colorMap = {
    'indigo taco': {
        title: 'Indigo Taco',
        text: 'Indigo Taco is a subtle bluish tone.',
        image: {
            url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDN1JRbF9ZMHZsa1k/style-color-uiapplication-palette1.png',
            accessibilityText: 'Indigo Taco Color',
        },
        display: 'WHITE',
    },
    'pink unicorn': {
        title: 'Pink Unicorn',
        text: 'Pink Unicorn is an imaginative reddish hue.',
        image: {
            url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDbFVfTXpoaEE5Vzg/style-color-uiapplication-palette2.png',
            accessibilityText: 'Pink Unicorn Color',
        },
        display: 'WHITE',
    },
    'blue grey coffee': {
        title: 'Blue Grey Coffee',
        text: 'Calling out to rainy days, Blue Grey Coffee brings to mind your favorite coffee shop.',
        image: {
            url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDZUdpeURtaTUwLUk/style-color-colorsystem-gray-secondary-161116.png',
            accessibilityText: 'Blue Grey Coffee Color',
        },
        display: 'WHITE',
    },
};

// In the case the user is interacting with the Action on a screened device
// The Fake Color List will display a list of color cards
const fakeColorList = () => {
    const list = new List({
        title: 'Fake Colors',
        items: {
            'indigo taco': {
                title: 'Indigo Taco',
                synonyms: ['indigo', 'taco'],
                description: 'This is a description of a list item.',
                image: new Image({
                    url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDN1JRbF9ZMHZsa1k/style-color-uiapplication-palette1.png',
                    alt: 'Indigo Taco Color',
                }),
            },
            'pink unicorn': {
                title: 'Pink Unicorn',
                synonyms: ['pink', 'unicorn'],
                description: 'This is a description of a list item.',
                image: new Image({
                    url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDbFVfTXpoaEE5Vzg/style-color-uiapplication-palette2.png',
                    alt: 'Pink Unicorn Color',
                }),
            },
            'blue grey coffee': {
                title: 'Blue Grey Coffee',
                synonyms: ['blue', 'grey', 'coffee'],
                description: 'This is a description of a list item.',
                image: new Image({
                    url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDZUdpeURtaTUwLUk/style-color-colorsystem-gray-secondary-161116.png',
                    alt: 'Blue Grey Coffee Color',
                }),
            },
        }
    });
    return list;
};

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'
app.intent('favorite color', (conv, { color }) => {
    const luckyNumber = (color as string).length;
    console.log(`[favorite color]: name: ${(conv.user.storage as any).userName}`);
    if ((conv.user.storage as any).userName) {
        conv.ask(`${(conv.user.storage as any).userName}, your lucky number is ${luckyNumber}. Would you like to hear some fake colors?`);
        conv.add(new Suggestions('Yes', 'No'));
    } else {
        conv.ask(`Your lucky number is ${luckyNumber}. Would you like to hear some fake colors?`);
        conv.add(new Suggestions('Yes', 'No'));
    }
});

// Handle the Dialogflow follow-up intents
app.intent(['favorite color - yes', 'favorite fake color - yes'], (conv) => {
    conv.ask('Which color, indigo taco, pink unicorn or blue grey coffee?');
    // If the user is using a screened device, display the carousel
    if (conv.screen) return conv.ask(fakeColorList());
});

// Handle the Dialogflow intent named 'favorite fake color'.
// The intent collects a parameter named 'fakeColor'.
app.intent('favorite fake color', (conv, { fakeColor }) => {
    fakeColor = conv.arguments.get('OPTION') || fakeColor;
    console.log(`[favorite fake color]: fakeColor = ${fakeColor}`);
    // Present user with the corresponding basic card and end the conversation.
    if (!conv.screen) {
        conv.add(colorMap[fakeColor as string].text);
    } else {
        conv.add('Here you go.', new BasicCard(colorMap[fakeColor as string]));
    }
    conv.add(new Suggestions('Yes', 'No'));
    conv.ask('Do you want to hear about another fake color?');
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
