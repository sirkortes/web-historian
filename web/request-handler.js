var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var qs = require('querystring');
// require more modules/folders here!

archive.downloadUrls(['www.google.com']);
exports.handleRequest = function (req, res) {

	console.log( "\n\nREQ URL:",req.url );
	console.log( "REQ METHOD:",req.method );

	
	if ( req.method === "POST"){

		var serveFile;

			// serve index
			if ( req.url === '/' ){
				fs.readFile( (archive.paths.siteAssets+'/index.html'), function(err, data) {
				  if (err) throw err;
				  serveFile = data;
				  // res.end(data);
				});
			} 
					
			// serve rest of assets
			var dataUrl;

			req.on('data', function(chunk){
				dataUrl = qs.parse(chunk.toString()).url;
			}); 


			req.on('end', function() {

				console.log("DATA FROM POST", dataUrl);

				fs.readFile( 
					// check in archivedSites
					(archive.paths.archivedSites+dataUrl), 
					function(err, archivedFile) {

						// if not in archivedSites
					  if (err) {
					  	// get the list
					  	fs.readFile( (archive.paths.list), function(err, list) {
								  if (err){ console.log("LIST WASNT FOUND"); }
								  
								  // CHECK IN LIST IF IT INCLUDES DATAURL
								  var splitList = list.toString().split(',');

								  if ( !splitList.includes(dataUrl) ){

								  	var newFileContent = list.length === 0 ? dataUrl : (list+","+dataUrl);
								  	// add url to list
									  fs.writeFile(archive.paths.list, newFileContent, 
									  	function(err) { if (err) throw err;
										  console.log('ADDED URL: '+dataUrl,list.toString());
										});

								  } else {
								  	console.log("LIST HAD URL: "+dataUrl)
								  }
								  
								  // we alrways respond with loading.html
								  fs.readFile( (archive.paths.siteAssets+'/loading.html'), function(err, loadingFile) {
										  // if (err) throw err;
										  if (err) console.log("ERROR SENDING LOADING FILE",err);
										  // console.log("Serving to loading: ",loadingFile.toString('ascii'));
										  serveFile = loadingFile.toString('ascii');
										  res.end(serveFile);
									});

							});
					  } else {
						  // if site IS in archives
						  // respond with page in archives
						  // console.log("Serving to archived: ",archivedFile.toString('ascii'));
						  serveFile = archivedFile.toString('ascii');
						  res.end(serveFile);
					  }

				});

			});

			// console.log("FINAL SERVE", serveFile)
			// res.end(serveFile);
			
	}


	else if ( req.method === "GET"){

			// serve index
			if ( req.url === '/' ){

					fs.readFile( 
						// url
						(archive.paths.siteAssets+'/index.html'), 
						// callback
						function(err, data) {
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
	}

			

};