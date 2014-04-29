var fs = require('fs');
var csv = require('csv');

var data = {};
var stores = [];

csv()
    .from.path(__dirname + '/query_result.csv', {
        delimiter: ',',
        escape: '"',
        columns: true,
        header: true
    })
    .transform(function(row) {
        var data = row;
        data.location = {
            "__type": "GeoPoint",
            latitude: Number(row.latitude),
            longitude: Number(row.longitude)
        };
        delete data.latitude;
        delete data.longitude;
        data.zipcode = Number(row.zipcode)
        return data;

    })
    .on('record', function(row, index) {
        stores[index] = row;
    })
    .on('end', function() {

        data.results = stores;

        var fs = require('fs');
        fs.writeFile(__dirname + '/StoreLocator.json', JSON.stringify(data), function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
            }
        });
    })
    .on('close', function(count) {
        console.log('Number of stores: ' + count);
    })
    .on('error', function(error) {
        console.log(error.message);
    });