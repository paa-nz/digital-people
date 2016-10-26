var fs  = require("fs");
console.log('{');
console.log(' "nodes":[');
fs.readFileSync('./Digital Profile.tsv').toString().split('\n').forEach(function (line) {
    var columns = line.split('\t');

    if(!columns[1]){
      columns[1] = 0;
    }

    var tags = [];
    for(var i = 3; i<columns.length; i++) {
      columns[i] = columns[i].replace(/(\r\n|\n|\r)/gm,"")
      if(columns[i].length>1){
        tags.push(JSON.stringify(columns[i]))
      }
    }

  console.log('         {"reference":'+columns[0]+', "year": '+columns[1]+', "text":"'+columns[2]+'", "tags":['+tags+']},')
    fs.appendFileSync("./output.json");
});
console.log('         ]') // nodes array
console.log('}')

// node transform.js > yes.json
// try tab seperated values to seperate each line by sheet column.
// or use push to add each column value to new output.json seperatly.
