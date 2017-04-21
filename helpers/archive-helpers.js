var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
// var effin = require('../workers/htmlfetcher');
/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */



exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {

	fs.readFile( exports.paths.list, function(err, list) {
	  if (err){ console.log("LIST WASNT FOUND"); }
	  var splitList = list.toString().split('\n');
	  callback(splitList); 
  });
};

exports.isUrlInList = function(url, callback) {

	exports.readListOfUrls(function(list){ 
		if ( list.includes(url) ){
			callback(true);
		} else {
			callback(false);
		}
	});
};

exports.addUrlToList = function(url, callback) {

	var list = exports.readListOfUrls(function(list){ 

		var newContent;
		if(list.length === 1 && list[0] === ''){
			newContent = url+'\n';
		} else {
			list.push(url)
			newContent = list.join('\n');
		}

	  fs.writeFile(exports.paths.list, newContent, 
	  	function(err) { if (err) throw err;
		});

		if ( callback ) callback();
	});
};

exports.isUrlArchived = function(url, callback) {

	fs.readFile( 
		(exports.paths.archivedSites+'/'+url), 
		function(err, archivedFile) {

		  if (err) {  
		  	callback(false);
			} else {
				callback(true);
			} 
	});

};

exports.downloadUrls = function(urls, callback){

	urls.forEach(function(url){


		http.get({ host: url, path: '/index.html' }, function(res) {

		  var data = '';

		  res.on('data', function(chunk){
		  	data += chunk.toString();		  	
		  });

		  res.on('end', function(){
				fs.writeFile( (exports.paths.archivedSites+'/'+url), data, function(err){
					if (err){ console.log("YOU FUCKED UP: ", err) }
				});	  	
		  });

		  if ( callback ) callback();

		}).on('error', function(e) {
		  console.log("Got error: " + e.message);
		});

	});

};

exports.returnArchive =function(url, callback){
	fs.readFile( (exports.paths.archivedSites+'/'+url), 
		function(err, website) {
	  if (err) console.log("ERROR LOADING ARCHIVED WEBSITE"+url, err);
	  callback(website.toString('ascii'));
	});
};

exports.serveLoading = function(callback){
	var loadingPage = '';
	fs.readFile( (exports.paths.siteAssets+'/loading.html'), function(err, loadingFile) {
		  if (err) console.log("ERROR SENDING LOADING FILE",err);
		  callback( loadingFile.toString('ascii') );
	});
};
