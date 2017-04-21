var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var qs = require('querystring');
var helpers = require('./http-helpers');
var effin = require('../workers/htmlfetcher');

exports.handleRequest = function (req, res) {

	var statusCode = 200;

	
	if ( req.method === "POST"){

			var serveFile;

			// serve index
			if ( req.url === '/' ){
				fs.readFile( (archive.paths.siteAssets+'/index.html'), function(err, data) {
				  if (err) throw err;
				  serveFile = data;
				});
			} 
					
			// serve rest of assets
			var dataUrl;

			req.on('data', function(chunk){
				dataUrl = qs.parse(chunk.toString()).url;
			}); 


			req.on('end', function() {

				archive.isUrlArchived(dataUrl, function(downloaded){
					// if downloaded, return file
					if ( downloaded ){
						archive.returnArchive( dataUrl, function(page){
							statusCode = 200;
							res.writeHead(statusCode, helpers.headers)
							res.end(page);
						});
					}
					// if not downloaded, get the list
					else {

						archive.isUrlInList( dataUrl, function(answer){ 
							if (answer === false){
								archive.addUrlToList( dataUrl );
							}
							archive.serveLoading(function(page){
								statusCode = 302;
								res.writeHead(statusCode, helpers.headers)
								res.end(page);
								effin.mothaFetcher();
							});
						});
					}
				});
			});


	}//if POST

	else if ( req.method === "GET"){

		var regex = new RegExp('(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})');

			// serve index
			if ( req.url === '/' ){

				fs.readFile((archive.paths.siteAssets+'/index.html'), function(err, data) {
				  if (err) throw err;
				  res.end(data);
				});
			}
			// serve style
			else if ( req.url === '/styles.css' ){

				fs.readFile( ( archive.paths.siteAssets + req.url ), function(err, data) {
				  if (err) throw err;
				  res.end(data);
				});
			}

			// when getting urls
			else if ( req.url.match( regex ) ){
				archive.returnArchive( req.url, function(page){
					statusCode = 200;
					res.writeHead(statusCode, helpers.headers)
					res.end(page);
				});
			}

			// when other page
			else {
				archive.serveLoading(function(page){
					statusCode = 404;
					res.writeHead(statusCode, helpers.headers)
					res.end(page);
				});
			}
	}

}; // exports