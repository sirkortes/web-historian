var archive = require('../helpers/archive-helpers');
var fs = require('fs');

exports.mothaFetcher = function () {
	archive.readListOfUrls(function(list){
		list = list.filter(function(web){ return web !== ''; });
		archive.downloadUrls(list, function(){
			fs.writeFile( archive.paths.list, '', 
		  	function(err) { 
		  		if (err) throw err;
			});
		});
	});
};
