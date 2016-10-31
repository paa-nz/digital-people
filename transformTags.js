var fs  = require("fs");
var userFile = process.argv[2] // error handling

var output = '{ "nodes":[{ "group": 10, "text":"DigitalProfile", "tags":["People","Digital literacy","Digital consumption","Online skills","Visual perception / information visualisation","Cognitive processing","Social ties / social network","Social behaviour / social networking","Workplace connectivity","Quantified workplace","Electronic collaboration","Quantified self / self-tracking","Extended self","Digital footprint","Digital neighbourhood","Privacy and digital surveillance","Personality traits","Physical disorders","Impact of computerisation","Diversity"] },'

var subOutput = "";
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

    if(tags.length>1) {
      for (var i = 0; i < tags.length; i++) { // make this recursive, a couple have sub-sub categories
      subOutput += ' { "group": 2, "text":'+(tags[i])+', "tags":['+(tags[i+1])+'] }, '
      tags.splice(i+1, 1)
      }
    }

  newLine = ' {"group": '+group+', "text":"'+(columns[0])+'", "tags":['+(tags)+'] }, ' // creates a node for catagories
  output += newLine
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

  newLine = '{"group": 3, "reference":"'+(columns[0])+'", "year": "'+columns[1]+'", "text":"'+(columns[2])+'", "tags":['+(tags)+']},'
  dataPoints += newLine
})

output += subOutput+dataPoints+'          ] }'
output = output.replace(/,(?=[^,]*$)/, '') // this is a string cos it is JSON. Need to JSON.parse to use js on it.



var x = JSON.parse(output);

output = JSON.stringify(mergeObjectsWithSameText(x))

var dp = createDigitalProfileNode(x) /// work on this .

output = output.replace(/}(?=[^}]*$)/, ',') // make room for links

output += '"links": '+JSON.stringify(createLinks(x)) +'}'

function createDigitalProfileNode(data){

    var tags = []
    for (var i = 0; i < data.nodes.length; i++) {
      if(data.nodes[i].group == 1){
        tags.push(JSON.stringify(data.nodes[i].text))
      }
    }
    var DigitalProfile ='{ "group": 10, "text":"DigitalProfile", "tags":['+tags+'] }'
    return DigitalProfile
}

function mergeObjectsWithSameText(data) {
  //console.log(typeof(data.nodes));
    for (var i=1; i< data.nodes.length;)          {   // every node {} in the graphData
      if(data.nodes[i].text === data.nodes[i-1].text){
        for (var j = 0; j < data.nodes[i].tags.length; j++) {   // for the first nodes tags
          data.nodes[i-1].tags.push(data.nodes[i].tags[j])    // add them to the 2nd nodes tags
        }
        data.nodes.splice(i, 1)     // delete the first node
      }else{
        i++
      }

  }
  return data
}



function createLinks(data){
var rawLinks = [];
  for (var i=0; i< data.nodes.length; i++){   // every node {} in the graphData
    for (var j=0; j< data.nodes[i].tags.length; j++){    //every node {}s tags []
      for (var k=0; k< data.nodes.length; k++){        // every node {}
        if(i != k && data.nodes[i].group != data.nodes[k].group) { // if they are not the same node, or same group.
            if(data.nodes[i].tags[j] == data.nodes[k].tags[j]){
              rawLinks.push({"source": i,"target":k})
            }
        }
      }
    }
  }

  for (var i=0; i< data.nodes.length; i++){ // perhaps adapt to other groups. 
    if(data.nodes[i].group == 1){
      rawLinks.push({"source": 0,"target":i})
    }
  }
  return rawLinks;
}

fs.appendFileSync("./output.json", output);
