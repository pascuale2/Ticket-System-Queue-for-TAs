
var request = require("request");
var http = require("https");
function getuserid(authtokn,res) {
    var options = {
        method: 'GET',
        url: 'https://api.zoom.us/v2/users/me',
        headers: {
            authorization: 'Bearer' +authtokn
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
    });
}
function getchannels(authtokn,res){
    var options = {
        method: 'GET',
        url: 'https://api.zoom.us/v2/chat/users/me/channels',
        qs: {page_size: '10'},
        headers: {authorization: 'Bearer'+ authtokn}
      };
      
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        var channels = JSON.parse(body).channels;     
        console.log(channels[0].id);
        res.locals.channels=body;
        var i;
        var channelchat=[];
        //for (i=0;i<channels.length;i++){}
        channelchat.push(getchat(authtokn,channels[0].id,res));
        
        res.render('chat');
      });
}
function getchat(authtokn,id,res){
    var options = {
        method: 'GET',
        url: 'https://api.zoom.us/v2/chat/users/me/messages',
        qs: {page_size: '50', to_channel: id},
        headers: {authorization: 'Bearer'+ authtokn}
      };
      
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
      
        console.log(body);
        return;
      });

}
module.exports.getuser=getuserid;
module.exports.getchannels=getchannels;