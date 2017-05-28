function Chat( elem, conversation ){
    if( !elem ) return;
    // Target Element
    this.canvas = elem;
    this.conversation = conversation;

    // Create the nessesary children
    this.chat = document.createElement('ul');
    this.answers = document.createElement('div');

    // Assign the Classes to the Elements
    this.chat.className = 'chat__list';
    this.answers.className = 'chat__answers';

    // Append the Elements to the Canvas
    this.canvas.appendChild( this.chat );
    this.canvas.appendChild( this.answers );

    // Kick the Conversation off!
    this.say("start");
}

Chat.prototype.createBubble = function( text, response ){
    var bubble = document.createElement('div');

    bubble.className = ( response == true ) ? 'chat__bubble chat__bubble--response' : 'chat__bubble';
    bubble.innerHTML = text;

    return bubble;
}

Chat.prototype.addBubble = function( bubble, options ){

    var options = Object.assign({}, {
        end: function(){},
        animate: true,
    }, options);

    var item = document.createElement('li');
    item.className = 'chat__item';
    item.appendChild( bubble );

    if( options.animate == true ){
        var content = bubble.innerHTML;
        bubble.innerHTML = "…";
        bubble.style.transform = "translate( -4em, 0 )";
        bubble.style.opacity = "0";

        setTimeout(function(){
            bubble.style.transform = "translate( 0, 0 )";
            bubble.style.opacity = "1";
        }, 30);

        setTimeout(function(){
            bubble.innerHTML = content;
            options.end.call( this, item );
        }.bind(this), 800);
    }

    this.chat.appendChild( item );
}

Chat.prototype.addAnswer = function( bubble, options ){

    var options = Object.assign({}, {
        delay: 0,
        end: function(){}
    }, options);

    bubble.style.transform = "translate( 0, 3em )";
    bubble.style.opacity = "0";

    setTimeout( function(){
        bubble.style.transform = "translate( 0, 0 )";
        bubble.style.opacity = "1";
    }, options.delay );

    bubble.addEventListener( 'transitionend', options.end.bind( this, bubble ), false );

    this.answers.appendChild( bubble );
}

Chat.prototype.animateAnswer = function( answer, options ){

    var options = Object.assign({}, {
        end: function(){}
    }, options);

    var children = [].slice.call( answer.parentNode.children );
    children.forEach(function( child ){
        if( child == answer ) return;

        child.style.transform = "translate( 0, 3em )";
        child.style.opacity = "0";
    });


    var bubble = answer.cloneNode(true);
    bubble.style.visibility = "hidden";
    this.addBubble(bubble, { animate: false });

    var bubbleR = bubble.getBoundingClientRect();

    bubble.style.display = "none";

    var answerR = answer.getBoundingClientRect();

    answer.addEventListener('transitionend', function(){
        this.answers.innerHTML = "";
        bubble.style.visibility = "";
        bubble.style.display = "";
        options.end.call(this);
    }.bind(this));

    answer.style.transform = "translate("+( bubbleR.left-answerR.left )+"px,"+( bubbleR.top-answerR.top )+"px)";
}

Chat.prototype.chooseAnswer = function( answers ){
    var answers = answers instanceof Array ? answers : [answers];

    answers.forEach(function(answer, index){
        var bubble = this.createBubble( answer.text, true );
        bubble.addEventListener('click', function(){

            this.animateAnswer(bubble, {
                end: function(){
                    if( "path" in answer ){
                        this.say( answer.path );
                    }
                    if( "callback" in answer ){
                        answer.callback.call( this );
                    }
                }
            });


        }.bind(this));
        this.addAnswer(bubble, {
            delay: index * 50
        });
    }.bind(this));
}

Chat.prototype.writeAnswer = function( answer ){
    var _this = this;
    var bubble = this.createBubble('', true);
    bubble.classList.add('chat__bubble--input');
    bubble.contentEditable = true;

    function sendMessage(){
        if( !bubble.innerText ) return;

        bubble.contentEditable = false;
        var message = bubble.innerText;

        _this.animateAnswer(bubble, {
            end: function(){
                if( "path" in answer ){
                    _this.say( answer.path );
                }
                if( "callback" in answer ){
                    answer.callback.call( _this, message );
                }
            }
        })

    }

    bubble.addEventListener('paste', function(event){
        requestAnimationFrame(function() {
            bubble.innerHTML = bubble.innerText;
        });
    });

    bubble.addEventListener( 'blur', sendMessage );

    bubble.addEventListener('keydown', function(event){
        if( event.keyCode == 13 ){
            event.preventDefault();
            bubble.removeEventListener( 'blur', sendMessage );
            sendMessage();
        }
    });

    this.addAnswer(bubble, {
        end: function(){
            bubble.focus();
        }
    });
}

Chat.prototype.say = function( path ){
    var message = this.conversation[ path ];
    var message = message instanceof Array ? message : [message];

    for( var i = 0; i < message.length; i++ ){
        setTimeout( function( item ){
            if( typeof item == 'object' ){
                if( item.type == 'choose' ){
                    this.chooseAnswer( item.answers );
                }else if( item.type == 'text' ){
                    this.writeAnswer( item );
                }
            }else{
                var bubble = this.createBubble( item );
                this.addBubble( bubble );
            }
        }.bind( this, message[i] ), 1200 * i + 350 );
    }

}
