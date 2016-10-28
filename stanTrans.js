// This will take the Digital Profile tsv and output it for use in the d3 force directed diagram.
// node stanTrans.js DigitalProfile.tsv

// Give catagories a group/special tag. When creating links if the node has the special tag the are an anchor for other nodes other wise not. Nodes without tags only join to catagorie nodes not other nodes.

var fs  = require("fs");
var userFile = process.argv[2] // error handling
console.log(userFile);

var output = '{ "nodes":[';
var newLine;
fs.readFileSync('./'+userFile+'').toString().trim().split('\n').forEach(function (line) {
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

  newLine = '{"reference":'+columns[0]+', "year": '+columns[1]+', "text":"'+columns[2]+'", "tags":['+tags+']},'
  output += newLine
});
 output += '          ] }'
 output = output.replace(/,(?=[^,]*$)/, '') // use regex to remove trailing comma
 console.log(typeof(output))
 // 2 Ways. Create source/target data from within the above process. Or use the output as an obj and draw from that.

var data = JSON.parse(output) // output is still JSON string?
console.log(typeof(data));
var rawLinks = [];
var links = [];

  for (var i=0; i< data.nodes.length; i++){   // every node {} in the graphData
    for (var j=0; j< data.nodes[i].tags.length; j++){    //every node {} tags []
      for (var k=0; k< data.nodes.length; k++){        // every node {}
        if(i != k) {
            if(data.nodes[i].tags[j] == data.nodes[k].tags[j]){
              rawLinks.push({"source": i,"target":k})
            }
        }
      }
    }
  }

  rawLinks.forEach(function(d){     //for each element in rawLinks, d
  	var sourceTemp = d.source;
    var targetTemp = d.target;       //take the values and assign
  	if(d.source > d.target){         // if d.s > d.t
  		d.source = targetTemp;          // assign d.t to d.target
  		d.target = sourceTemp;
  	}
  });

function removeDups(a){
    a.sort();
    for(var i = 1; i < a.length; ){
        if(a[i-1].source === a[i].source && a[i-1].target === a[i].target){
            a.splice(i, 1);
            } else {
            i++;
            }
        }
    return a;
    }

var links = removeDups(rawLinks);

output = output.replace(/}(?=[^}]*$)/, ',')
console.log(output);

output += '"links": '+JSON.stringify(links)+'}';

fs.appendFileSync("./combinedOutput.json", output);
