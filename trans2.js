var fs  = require("fs");
var graphData = JSON.parse(fs.readFileSync('./710.json', 'utf8'));
var rawLinks = [];
var links = [];

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
console.log(' "links":['  + links);
for (var i = 0; i < links.length; i++) {
  console.log(JSON.stringify(links[i])+",")
}
console.log('         ]');
