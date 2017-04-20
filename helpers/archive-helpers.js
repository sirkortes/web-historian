var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
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

	fs.readFile( (archive.paths.list), function(err, list) {
	  
	  if (err){ console.log("LIST WASNT FOUND"); }
	  
	  var splitList = list.toString().split(',');

	  console.log("readListOfUrls CALLBACK",callback);
	  if ( calllback ) { callback(splitList); }
	  else { return splitList; }

  });

};

exports.isUrlInList = function(url, callback) {

	var list = this.readListOfUrls();

	if ( !list.includes(url) ){
		if ( callback ){ 
			callback(false);
		} else { 
			return false; 
		}
	} else {
		if ( callback ){ 
			callback(true);
		} else { 
			return true; 
		}
	}

};

exports.addUrlToList = function(url, callback) {

	var list = this.readListOfUrls();

	var newFileContent = list.length === 0 ? url : (list+","+url);
	// add url to list
  fs.writeFile(archive.paths.list, newFileContent, 
  	function(err) { if (err) throw err;
	  console.log('ADDED URL: '+url );
	});

};

exports.isUrlArchived = function(url, callback) {

	fs.readFile( 
		// check in archivedSites
		(archive.paths.archivedSites+url), 
		function(err, archivedFile) {

		  if (err) { 
		  	// false
		  	if ( callback ){ 
					callback(false);
				} else { 
					return false; 
				}

			} else {
				if ( callback ){ 
					callback(true);
				} else { 
					return true; 
				}
			}
		  
	});

};

exports.downloadUrls = function(urls){

	console.log("Calling downloadUrls")
	// go through each
	urls.forEach(function(url){
		// get request?
		console.log("URL: ",url);
		// http.get(url, function(response){
		// 	console.log("RESPONSE: ", Object.keys(response))
		// 	console.log("RESPONSE DOMAIN: ", response.client)
		// })	

		var options = {
		  host: url,
		  port: 80,
		  path: '/index.html'
		};

		http.get(options, function(res) {
		  console.log("Got response: " + res.statusCode);
		}).on('error', function(e) {
		  console.log("Got error: " + e.message);
		});

		// write to a new file
	})

		// visit each page
		// copying to new file
		// save that file in our archives, name of file is url
		// remove from list 

};
