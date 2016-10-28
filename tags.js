var fs  = require("fs");
var userFile = process.argv[2] // error handling

var output = '{ "nodes":[';
var newLine;
var group = 1;
fs.readFileSync('./'+userFile+'').toString().trim().split('\n').forEach(function (line) {
    var columns = line.split('\t');

    var tags = [];
    for(var i = 1; i<columns.length; i++) {
      columns[i] = columns[i].replace(/(\r\n|\n|\r)/gm,"")
      if(columns[i].length>1){
        tags.push(JSON.stringify(columns[i]))
      }
    }

  newLine = ' {"group": '+group+', "text":"'+columns[0]+'", "tags":['+tags+'] }, ' // creates a node for catagories
  output += newLine

});
 output += '          ] }'
 output = output.replace(/,(?=[^,]*$)/, '') // use regex to remove trailing comma

 // 2 Ways. Create source/target data from within the above process. Or use the output as an obj and draw from that.

var data = JSON.parse(output) // output is still JSON string?
var rawLinks = [];
var links = [];
console.log(data);
  for (var i=1; i< data.nodes.length;)          {   // every node {} in the graphData
      if(data.nodes[i].text === data.nodes[i-1].text){
        console.log("text match", i);
        for (var j = 0; j < data.nodes[i].tags.length; j++) {   // for the first nodes tags
          data.nodes[i-1].tags.push(data.nodes[i].tags[j])    // add them to the 2nd nodes tags
        }
        data.nodes.splice(i, 1)     // delete the first node
      }else{
        i++
      }

  }

console.log(JSON.stringify(data), ' her');

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

output += '"links": '+JSON.stringify(links)+'}';

fs.appendFileSync("./tagOutput.json", output);
