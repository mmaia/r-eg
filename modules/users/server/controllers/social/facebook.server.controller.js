'use strict';

var https = require('https');

var facebookCall = function(userAccessToken, apiPath, callback){
    var options = {
        host: 'graph.facebook.com',
        port: 443,
        path: apiPath + '?access_token=' + userAccessToken,
        method: 'GET'
    };

    var buffer = ''; //buffer to group packages received from facebook...
    var request = https.get(options, function(result){
        result.setEncoding('utf-8');

        //group data in buffer
        result.on('data', function(chunk){
            buffer += chunk;
        });

        //when finished return the callback with complete data from buffer.
        result.on('end', function(){
            callback(buffer);
        });
    });

    //deals with error..
    request.on('error', function(e){
        console.log('O-O oh crap! Got an error while talking to facebook! You can try again anytime and please, cross your fingers! A little help is always welcome!');
    });
    request.end();
};

exports.talkToFacebook = function(req, res){
    console.log('trying to talk to facebook...');
    var user = req.user;
    facebookCall(user.facebook.accessToken, '/me/friends', function(data){
        console.log('data');
        res.json(data);
    });

};
