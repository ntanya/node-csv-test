var sys;
try {
  sys    = require('util'); 
} catch (e) {
  util = require('util');
}
var csv = require('ya-csv');
var http    = require('http');

var reader = csv.createCsvFileReader('test.csv', { columnsFromHeader: true });
var writer = csv.createCsvFileWriter('out.csv');


/*
reader.addListener('data', function(data) {
    // supposing there are so named columns in the source file
    sys.puts(data.article_id + " ... " + data.media_provider);
});
*/

reader.addListener('data', function(data) {
	console.log(data);
	
	var myarr  = new Array();
	myarr['id'] = data.status_id;
    	myarr['tweet_source'] = data.tweet_source; 
    	writer.writeRecord(myarr);
    	/*
	
	if(data.media_provider === 'TWITTER'){
        httpGet('/1/statuses/show.json?id=' +data.status_id, function(error, response){

    	data.tweet_source = extractLinkName(response.source);
    	console.log('new field is: ' + data.tweet_source);
    	
    	myarr['id'] = data.status_id;
    	myarr['tweet_source'] = data.tweet_source; 
    	writer.writeRecord(myarr);
    	
    	});	
    } 

	*/
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