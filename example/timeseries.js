'use strict';

let anomalyDetection = new (require('../'))({
	returnType: 2,
	confidenceInterval: 4,
	trendingFactor: 0.2,
});

let log = (msg) => process.stdout.write(msg);
let threshold = 0.5;
let i = 0;

let process = function(data){
  data.timeseries.forEach(function(row){
    let value = row[3].buckets[0][1].value;

    let anomaly = anomalyDetection.pushMeta(value);

    let mean   = anomaly.mean;
    let stddev = anomaly.stddev;
    let trend  = anomaly.trend;

    if (anomaly.anomaly == 'Infinity') return; // early anomalies
    if (anomaly.anomaly >= threshold ) console.log(`\x1B[2K\r[${1 + i}] mean: ${mean} stddev: ${stddev} trend: ${trend} value: ${value} anomaly: ${anomaly.anomaly}`);

    ++i;
  });
};

console.log('24h Series:');
let data_a = (require('./dataset0.js'));
process(data_a);

console.log('----');

console.log('7dd Series:');
let data_b = (require('./dataset1.js'));
process(data_b);
