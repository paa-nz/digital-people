var fs  = require("fs");
var userFile = process.argv[2] // error handling

var output = '{ "nodes":[';
var newLine;

fs.readFileSync('./'+userFile+'').toString().trim().split('\n').forEach(function (line) {
    var columns = line.split('\t');

    //console.log(columns);
    var tags = [];
    for(var i = 1; i<columns.length; i++) {
      columns[i] = columns[i].replace(/(\r\n|\n|\r)/gm,"")
      if(columns[i].length>1){
        tags.push(JSON.stringify(columns[i]))
      }
    }

  newLine = ' {"group": 1, "text":"'+columns[0]+'", "tags":['+tags+'] }, '

    // for (var i = 1; i < columns.length; i++) {
    //   columns[i] = columns[i].replace(/(\r\n|\n|\r)/gm,"")
    //   newLine+='  "tags":['+columns[i]+']" '
    //
    // }

  output += newLine


});
 output += '          ] }'
 output = output.replace(/,(?=[^,]*$)/, '') // use regex to remove trailing comma

 // 2 Ways. Create source/target data from within the above process. Or use the output as an obj and draw from that.

fs.appendFileSync("./tagOutput.json", output);

// var rawLinks = [];
// var links = [];
//
//   for (var i=0; i< graphData.nodes.length; i++){   // every node {} in the graphData
//     for (var j=0; j< graphData.nodes[i].tags.length; j++){    //every node {} tags []
//       for (var k=0; k< graphData.nodes.length; k++){        // every node {}
//         if(i != k) {
//             if(graphData.nodes[i].tags[j] == graphData.nodes[k].tags[j]){
//               rawLinks.push({"source": i,"target":k})
//             }
//         }
//       }
//     }
//   }
//
//   rawLinks.forEach(function(d){     //for each element in rawLinks, d
//   	var sourceTemp = d.source;
//     var targetTemp = d.target;       //take the values and assign
//   	if(d.source > d.target){         // if d.s > d.t
//   		d.source = targetTemp;          // assign d.t to d.target
//   		d.target = sourceTemp;
//   	}
//   });
//
// function removeDups(a){
//     a.sort();
//     for(var i = 1; i < a.length; ){
//         if(a[i-1].source === a[i].source && a[i-1].target === a[i].target){
//             a.splice(i, 1);
//             } else {
//             i++;
//             }
//         }
//     return a;
//     }
//
// var links = removeDups(rawLinks);
// console.log(' "links":['  + links);
// for (var i = 0; i < links.length; i++) {
//   console.log(JSON.stringify(links[i])+",")
// }
// console.log('         ]');


// if laast line output += this
// console.log(output);
