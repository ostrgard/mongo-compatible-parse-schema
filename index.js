var axios = require('axios');
var pme = require('commander');
var jsonfile = require('jsonfile');

function format(src, verbose) {
  return src.map(function(c) {

    var ret = {
      "_id": c.className
    };

    if (verbose) console.log(' - Parsing classname ' + c.className + '.');

    Object.keys(c.fields).forEach(function(f) {
      var field = c.fields[f];

      if (field.type === 'Pointer') {
        ret[f] = '*' + field.targetClass;
      } else if (field.type === 'Relation') {
        ret[f] = 'relation<' + field.targetClass + '>';
      } else if (f !== 'ACL') {
        ret[f] = field.type.toLowerCase();
      }
    })

    return ret;
  });
}

function getInput(file, applicationId, masterKey, verbose) {
  return new Promise(function(resolve, reject) {
    if (file) {
      if (verbose) console.log(' - Reading schema from ' + file + '.');
      jsonfile.readFile(file, function (err, obj) {
        if (err) {
          reject(err);
        } else {
          resolve(obj.map ? obj : obj.results);
        }
      });
    } else {
      if (verbose) console.log(' - Downloading schema from parse.com.');
      axios.get('https://api.parse.com/1/schemas', {
        headers: {
          'X-Parse-Application-Id': applicationId,
          'X-Parse-Master-Key': masterKey,
          'Content-Type': 'application/json'
        }
      }).then(function(response) {
        resolve(response.data.results);
      }).catch(function (error) {
        reject(error);
      });
    }
  });
}

pme
  .version('1.0.0')
  .option('-a, --application-id [name]', 'Your parse.com application id. Required if not providing a file.')
  .option('-m, --master-key [name]', 'Your parse.com master key. Required if not providing a file.')
  .option('-f, --file [name]', 'JSON file exportet from https://api.parse.com/1/schemas. Required if not providing an application id and master key.')
  .option('-o, --out [name]', 'Output file name for converted JSON [_SCHEMA.json]', '_SCHEMA.json')
  .option('-v, --verbose', 'Use verbose mode')
  .parse(process.argv);

if (pme.verbose) console.log('Running mongo-compatible-parse-schema:');
if (pme.verbose) console.log(' - Verbose.');
if (!pme.file && !(pme.applicationId && pme.masterKey)) {
  console.error('Error: Please provide a schema file, or a valid application id and master key.');
  return;
}

getInput(pme.file, pme.applicationId, pme.masterKey, pme.verbose).then(function(data) {
  var formatted = format(data, pme.verbose);
  if (pme.verbose) console.log(' - Writing to ' + pme.out + '.');
  jsonfile.writeFile(pme.out, formatted, function (err) {
    if (err) { console.error(err); return 0 }
    if (pme.verbose) console.log(' - Done.');
  })
}, function(error) {
  console.error(error);
});
