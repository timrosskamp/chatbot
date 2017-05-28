new Chat(document.getElementById('chat'), {
    start: [ 'Moin!', 'Möchten Sie reden oder mir eine Nachricht senden?', {
        type: 'choose',
        answers: [{
            text: 'Was gibt\'s neues?',
            path: 'whats-up'
        }, {
            text: 'Etwas schreiben!',
            path: 'contact'
        }]
    }],
    "whats-up": 'Also zu Zeit...',
    "contact": ['Dann erzähl mal!', {
        type: 'text',
        path: 'contact-thanks',
        callback: function(message){
            console.log( message );
        }
    }],
    "contact-thanks": ['Vielen Dank für die Nachricht!', 'Ich brauche noch Ihre E-Mail Adresse, damit ich auf Sie zurückkommen kann.', {
        type: 'text',
        callback: function( email ){
            if( /[^@\s]+@[^@\s]+\.[^@\s]+/.test(email) ){
                this.say('contact-success')
            }else{
                this.say('contact-wrong-email');
            }
        }
    }],
    "contact-wrong-email": ["Hmm", "An der E-Mail Adresse kann etwas nicht stimmen", "Möchten Sie Sie erneut schreiben?", {
        type: 'choose',
        answers: [{
            text: 'Ja',
            path: 'contact-email-again'
        }, {
            text: 'Nein',
            path: 'contact-no-email'
        }]
    }],
    "contact-email-again": {
        type: 'text',
        callback: function( email ){
            if( /[^@\s]+@[^@\s]+\.[^@\s]+/.test(email) ){
                this.say('contact-success')
            }else{
                this.say('contact-wrong-email');
            }
        }
    },
    "contact-no-email": ["Kein Problem", "Ich notiere mir die Nachricht trotzdem :-)"],
    "contact-success": ["Vielen Dank!", "Ich habe mir die Nachricht und Ihre E-Mail notiert :-)"]
});
