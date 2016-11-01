var fs  = require("fs");
var userFile = process.argv[2] // error handling

var output = '{ "nodes":[{ "group": 10, "text":"Digital People", "tags":["People","Digital literacy","Digital consumption","Online skills","Visual perception / information visualisation","Cognitive processing","Social ties / social network","Social behaviour / social networking","Workplace connectivity","Quantified workplace","Electronic collaboration","Quantified self / self-tracking","Extended self","Digital footprint","Digital neighbourhood","Privacy and digital surveillance","Personality traits","Physical disorders","Impact of computerisation","Diversity"] },\n'
var DigitalPeople = output;
fs.readFileSync('./'+userFile+'').toString().trim().split('\n').forEach(function (line) {
    var columns = line.split('\t');

    for(var i = 1; i<columns.length; i++) {
      columns[i] = columns[i].replace(/(\r\n|\n|\r)/gm,"")
    }
    columns = columns.filter(function(entry) { return entry.trim() != ''; });

    var child; // change to parent
    for (var i = 1; i <= columns.length; i++) {
      !columns[i] ? child = columns[i-1] : child = columns[i]  // change this so child is the i-1 /text
      output += ' { "group": '+i+', "text":"'+(columns[i-1])+'", "tags":['+JSON.stringify(child)+'] }, \n'
    }

});

var dataPoints = ""
fs.readFileSync('./DigitalProfile.tsv').toString().trim().split('\n').forEach(function (line) {

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
  for (var i = 0; i < tags.length; i++) {
  dataPoints += '{"group": 5, "reference":"'+(columns[0])+'", "year": "'+columns[1]+'", "text":"'+(columns[2])+'", "tags":['+(tags[i])+']},'
  }
})

output += dataPoints+'          ] }'
output = output.replace(/,(?=[^,]*$)/, '') // this is a string cos it is JSON. Need to JSON.parse to use js on it.


var x = JSON.parse(output); //Have to parse to use in JS, to remove duplicates.

var group1 = x.nodes.filter(function(node){
    return (node.group == 1);
})
var group2 = x.nodes.filter(function(node){
    return (node.group == 2);
})
var group3 = x.nodes.filter(function(node){
    return (node.group == 3);
})
var group5 = x.nodes.filter(function(node){
    return (node.group == 5);
})
var group10 = x.nodes.filter(function(node){
    return (node.group == 10);
})
group1 = merge(group1)
group2 = merge(group2)
group3 = merge(group3)

output = JSON.stringify(group10.concat(group1, group2, group3, group5)); // an array of the nodes and datapoints.
//output = output.replace(/}(?=[^}]*$)/, ',') // make room for links, remnove }
output = '{ "nodes": '+output+' , "links": '+JSON.stringify(createLinks(output)) +'}'

function merge(grouping) {
    for (var i=1; i< grouping.length;)          {   // every node {} in the arr
      if(grouping[i].text === grouping[i-1].text){
        for (var j = 0; j < grouping[i].tags.length; j++) {   // for the first nodes tags
          grouping[i-1].tags.push(grouping[i].tags[j])    // add them to the 2nd nodes tags
        }
        grouping.splice(i, 1)     // delete the first node
      }else{
        i++
      }

    }
    return grouping /// will have duplicate tags in groups, remove in links.
}

function createLinks(nodes){
  nodes = JSON.parse(nodes)
var rawLinks = [];
  for (var i=0; i< nodes.length; i++){   // every element
    for (var j=0; j< nodes[i].tags.length; j++){    //every node {}s tags []
      for (var k=0; k< nodes.length; k++){        // every node {}
        if(i != k && nodes[i].group < nodes[k].group) { // if they are not the same node, or same group.
            if(nodes[i].tags[j] == nodes[k].tags[j]){
              rawLinks.push({"source": i,"target":k})
            }
        }
      }
    }
  }

  for (var i=0; i< nodes.length; i++){ // perhaps adapt to other groups.
    if(nodes[i].group == 1){
      rawLinks.push({"source": 0,"target":i})
    }
  }
  return removeDups(rawLinks); // return removeDups
}


function removeDups(a){ // mpt working
  a.forEach(function(d){     //for each element in rawLinks, d
    var sourceTemp = d.source;
    var targetTemp = d.target;       //take the values and assign
    if(d.source > d.target){         // if d.s > d.t
      d.source = targetTemp;          // assign d.t to d.target
      d.target = sourceTemp;
    }
  });

  a.sort();
  for(var i = 1; i < a.length; ){
      if(a[i-1].source == a[i].source && a[i-1].target == a[i].target){
          a.splice(i, 1);
          } else {
          i++;
          }
      }
  return a;
  }

fs.appendFileSync("./output.json", output);
