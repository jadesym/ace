var express = require('express');
var app = express();
var ha = require('homeaway-api')

// TODO: insert your clientId and secret here
var clientId = "22b224f9-2259-4912-9d94-c6e15efe37b3";
var clientSecret = "5f0dc000-7e53-4df6-bcbc-066a35ae073a";

// utility method to handle JSON response body
function handleJsonBody(response, withResponseBody) {
    var buffers = [];
    response.on("data", function(chunk) {
        buffers.push(chunk);
    });
    response.on("end", function() {
        withResponseBody(JSON.parse(Buffer.concat(buffers).toString("utf8")));
    });
};

ha.init(clientId, clientSecret);

app.set('port', (process.env.PORT || 5000));

app.get('/auth', function (req, res) {
    ha.getUserToken(req.query.ticket, function(tokenRes) {
        handleJsonBody(tokenRes, function(body) {
            var token = body.value;
            var email = encodeURIComponent(body.email);
            res.writeHead(302, {'Location': '/echo?token=' + token + "&email=" + email});
            res.end();
        });
    });
});

app.get('/echo', function (req, res) {
    res.send("<h4>you should not be seeing this page.  it's for debugging only.</h4>" + 
             "token is: " + req.query.token + ", email is: " + req.query.email);
    res.end();
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
