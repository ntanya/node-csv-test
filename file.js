var csv = require('csv');
var http    = require('http');

csv()

.fromPath(__dirname+'/test.csv', {columns: true})
.toPath(__dirname+'/test_out.csv',{columns: ['article_id', 'article_url', 'media_provider', 'tweet_source']})

.transform(function(data){

    if(data.media_provider === 'TWITTER'){
        httpGet('/1/statuses/show.json?id=' +data.status_id, function(error, response){

    	data.tweet_source = extractLinkName(response.source);
    	console.log('new field is: ' + data.tweet_source);
    	return data;
    	});	
    } 
})

.on('data',function(data,index){
    console.log('#'+index+' '+JSON.stringify(data));
})
.on('end',function(count){
    console.log('Number of lines: '+count);
})
.on('error',function(error){
    console.log(error.message);
});


httpGet = function(url, callback){
	var completeResponse = "";
	var options = {
	  host: 'api.twitter.com',
	  port: 80,
	  path: url
	};

	var dataObj = null;
	var status = 0;
	var request = http.get(options, function(result) {
	  //console.log("Got response: " + result.statusCode);
	  status = result.statusCode;
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	});

    request.on('response', function (response) {
	  response.on('data', function (chunk) {
		completeResponse += chunk;	
	  });	  
	  
	  response.on('end', function(){
		if(status == 200)
		{
			dataObj =  JSON.parse(completeResponse);
			callback(null,dataObj);
		}
		else{callback('error');}	 
	   });
	  
	});	
};

extractLinkName = function(link){
	var regex = />(.)+<\/a>/g;
	var matches =  link.match(regex);
	var output;
	
	if(matches){
	    output = matches[0].replace(/>/g, "");
	    return output.replace(/<a|<\/a/g,"");
	}
	else{return link};

}