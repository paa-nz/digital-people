// This is part of the temp solution until I figure how to combine the 2 sheets worth of nodes properly.

var fs  = require("fs");
var graphData = JSON.parse(fs.readFileSync('./byHandTemp.json', 'utf8'));
var rawLinks = [];
var links = [];
var output = graphData
  for (var i=0; i< graphData.nodes.length; i++){   // every node {} in the graphData
    for (var j=0; j< graphData.nodes[i].tags.length; j++){    //every node {} tags []
      for (var k=0; k< graphData.nodes.length; k++){        // every node {}
        if(i != k) {
            if(graphData.nodes[i].tags[j] == graphData.nodes[k].tags[j]){
              rawLinks.push({"source": i,"target":k})
            }
        }
      }
    }
  }

  for (var i = 0; i < graphData.nodes.length; i++) {
    if(graphData.nodes[i].group == 1) {
      rawLinks.push({"source": 0,"target":i})
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

// output = output.replace(/}(?=[^}]*$)/, ',')

output += JSON.stringify(output) + '"links": '+JSON.stringify(links)+'}';

fs.appendFileSync("./x.json", output);
