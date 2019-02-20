new Chat(document.getElementById('chat'), {
    start: ['Hi!', 'What\'s up?', 'Do you want to talk, or send me a message?', {
        type: 'choose',
        answers: [{
            text: 'I\'d prefer to talk.',
            path: 'just-talk'
        }, {
            text: 'Send a message!',
            path: 'contact'
        }]
    }],
    'just-talk': ['Okay!', 'I just build this chatbot! Isn\'t it amazing?', 'What do you think about it?', {
        type: 'choose',
        answers: [{
            text: 'It\'s great!',
            path: 'great-chatbot'
        }, {
            text: 'I don\'t like it.',
            path: 'dont-like-it'
        }]
    }],
    'great-chatbot': ['Thanks! ❤', 'You can check out the sourcecode at <a target="_blank" href="https://github.com/timrosskamp/chatbot">github.com/timrosskamp/chatbot</a>.'],
    'dont-like-it': ['Oh 😞', 'Are you sure you don\'t like me?', {
        type: "choose",
        answers: [{
            text: 'Okay. I like you!',
            path: 'great-chatbot'
        }]
    }],
    'contact': ['Alright!', 'Just type what you have in mind.', {
        type: 'text',
        path: 'contact-thanks',
        callback: function(message){
            console.log(message);
        }
    }],
    'contact-thanks': ['Great message!', 'I just need your email so I can get back to you!', {
        type: 'text',
        callback: function(mail){
            if( /[^@\s]+@[^@\s]+\.[^@\s]+/.test(mail) ){
                this.say('contact-success');
            }else{
                this.say('contact-wrong-email');
            }
        }
    }],
    'contact-wrong-email': ['Hmm.', 'I don\'t think this is a valid email address.', 'Do you wan\'t to try again?', {
        type: 'choose',
        answers: [{
            text: 'Yes!',
            path: 'contact-email-again'
        }, {
            text: 'No.',
            path: 'contact-no-email'
        }]
    }],
    'contact-email-again': {
        type: 'text',
        callback: function( email ){
            if( /[^@\s]+@[^@\s]+\.[^@\s]+/.test(email) ){
                this.say('contact-success');
            }else{
                this.say('contact-wrong-email');
            }
        }
    },
    'contact-no-email': ['No problem!', 'I\'m a chatbot anyway, not a postman 😁'],
    'contact-success': ['Thank you very much!', 'But I did\'t send anything 😉', 'I\'m a chatbot, not a postman 😁']
});
