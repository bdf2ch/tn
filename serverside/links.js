var mysql = require('mysql');
var http = require('http');
const querystring = require('querystring');
const url = require('url');
const async = require('async');
const exists = require('url-exists');


var connection = mysql.createConnection({
    host     : '192.168.91.24',
    user     : 'wfs_base',
    password : 'iuh',
    database : 'wfs_base'
});

connection.connect();

connection.query('SELECT * FROM attachments ORDER BY violation_id', function (error, results, fields) {
    if (error) throw error;
    var length = results.length;
    //for (var i = 0; i < length; i++) {

        //url = url.indexOf('kolu-wfs') !== -1 ? url.substr(32) :  '/' + url;
        //console.log('host: ', host);
        //console.log(link);


        async.eachSeries(results, function (item, callback) {
            let urlString  = item.URL;
            let host,path,path_,filename;
            let counter = 0;

            if (urlString.indexOf('kolu-wfs') !== -1) {
                host = url.parse(urlString).hostname;
                path = url.parse(urlString).path;
                let pathRaw = urlString.split('\\');
                let pathSplit = path.split('/');
                let urlStringSplit = path.split('/');
                filename = encodeURIComponent(pathRaw[pathRaw.length - 1]);
                urlStringSplit.pop();
                path_ = urlStringSplit.join('/');
                path_ += '/';
                //console.log('host: ' + host, ', path: ' + path, ', filename: ' + filename);

                options = {method: 'HEAD', host: host, port: 80, path: path_ + filename, headers: {'Content-Type': 'text/plain'}};
                var req = http.request(options, (res) => {
                    if (res.statusCode === 404) {
                        console.log('host: ' + host + ', path: ' + urlString +  ' - ', res.statusCode);
                        counter++;
                    }
                });
                req.end();
                callback(null);
                //console.log('not found: ' + counter + ' files');
            } else {
                urlString = 'http://wfs-prim.mrsksevzap.ru/' + urlString;
                host = url.parse(urlString).hostname;
                path = url.parse(urlString).path;
                let pathRaw = urlString.split('\\');
                let pathSplit = path.split('/');
                let urlStringSplit = path.split('/');
                filename = encodeURIComponent(pathRaw[pathRaw.length - 1]);
                urlStringSplit.pop();
                path_ = urlStringSplit.join('/');
                path_ += '/';
                //console.log('host: ' + host, ', path: ' + path, ', filename: ' + filename);

                options = {method: 'HEAD', host: host, port: 80, path: path_ + filename, headers: {'Content-Type': 'text/plain'}};
                var req = http.request(options, (res) => {
                    if (res.statusCode === 404) {
                        console.log('host: ' + host + ', path: ' + urlString +  ' - ', res.statusCode);
                        counter++;
                    } else {
                        //console.log('host: ' + host + ', path: ' + path_ + filename +  ' - ', res.statusCode);
                    }
                });
                req.end();
                callback(null);
                //console.log('not found: ' + counter + ' files');
            }

/*
            //console.log(item);
            var host = link.indexOf('kolu-wfs') === -1 ? url.parse('http://wfs-prim.mrsksevzap.ru').host : url.parse(link).hostname;
            link = link.indexOf('kolu-wfs') !== -1 ? link.substr(33) : link;
            var filename = link.split('\\');
            filename = filename[filename.length - 1];
            console.log(filename);
            */

        }, function (err) {
            console.log('error: ', err);
        });
    //}
    console.info('total files: ' + results.length);
});

connection.end();