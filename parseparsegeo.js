var fs = require('fs');
var csv = require('csv');

var data = {};
var places = [];

csv()
    .from.path(__dirname + '/' + process.argv[2], {
        delimiter: ',',
        escape: '"',
        columns: true,
        header: true
    })
    .transform(function(row) {
        row.location = {
            '__type': 'GeoPoint',
            latitude: Number(row.latitude),
            longitude: Number(row.longitude)
        };
        delete row.latitude;
        delete row.longitude;
        row.zipcode = Number(row.zipcode);
        return row;

    })
    .on('record', function(row, index) {
        places[index] = row;
    })
    .on('end', function() {

        data.results = places;

        fs.writeFile('./output/import-' + Date.now() + '.json', JSON.stringify(data), function(err) {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log("The file was saved!");
            }
        });
    })
    .on('close', function(count) {
        console.log('Number of places: ' + count);
    })
    .on('error', function(err) {
        console.log(err.message);
    });
