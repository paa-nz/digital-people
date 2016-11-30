document.addEventListener("DOMContentLoaded", function(event) {
var d3 = require("d3");
var dataList = document.getElementById('data');

var tagsVisible = true;
var refsVisible = true;

document.getElementById("toggleRefs").addEventListener("click", toggleDisplay);
document.getElementById("toggleTags").addEventListener("click", toggleDisplay);
document.getElementById("clearData").addEventListener("click", function() {
  document.getElementById("data").innerHTML = "";
  // AND ALL NODES BACK TO SMALLER RADUIUS
  // and return buttons to default state.

});

function toggleDisplay(e) {
  if(e.target.id=="toggleTags"){
    tagsSwitch(tagsVisible)
  }
  if(e.target.id=="toggleRefs"){
    refsSwitch(refsVisible)
  }
}
function tagsSwitch(visible) { // consider using classList in refactor to add/remove class rather than attr of class
  var tags = document.getElementsByClassName('tags')
   if(visible){
    for (var i = 0; i < tags.length; i++) {
      tags[i].style.display = 'none'
    }
    toggleTags.innerHTML = "TAGS ON";
    toggleTags.classList.toggle("off")
    tagsVisible = false;
   }else {
     for (var i = 0; i < tags.length; i++) {
       tags[i].style.display = 'block'
     }
     toggleTags.innerHTML = "TAGS OFF";
     toggleTags.classList.toggle("off")
     tagsVisible = true;
   }
}
 function refsSwitch(visible) {
   var refs = document.getElementsByClassName('refs')
    if(visible){
     for (var i = 0; i < refs.length; i++) {
       refs[i].style.display = 'none'
     }
     toggleRefs.innerHTML = "REFS ON"
     toggleRefs.classList.toggle("off")

     refsVisible = false;
    }else {
      for (var i = 0; i < refs.length; i++) {
        refs[i].style.display = 'block'
      }
      toggleRefs.innerHTML = "REFS OFF"
      toggleRefs.classList.toggle("off")

      refsVisible = true;
    }
 }
var graph
var radius = 6;
//Append a SVG to the body of the html page. Assign this SVG as an object to svg
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var color = d3.scaleOrdinal()
          .range(["#703030", "#2F343B" , "#7E827A", "#E3CDA4", "#C77966"]);;


d3.json("./output.json", function(json) {
  var graph = json

  var defs = svg.append('svg:defs');

  defs.append("svg:pattern")
        .attr("id", "vit-icon")
        .attr("width", 1)
        .attr("height", 1)
        .append("svg:image")
        .attr("xlink:href", "http://st2.depositphotos.com/1069290/10413/v/170/depositphotos_104132320-Leonardo-da-vinci-vitruvian-man.jpg")
        .attr("width", 80)
        .attr("height", 80)
        .attr("x", 0)
        .attr("y", 0)

  var simulation =
      d3.forceSimulation()
      .force("charge", d3.forceManyBody().strength(-50))
      .force("collide", d3.forceCollide().radius(function (d) {
                      if(d.group==0){return 48}
                      else{return 15 - d.group}
                      }).strength(2).iterations(2))
      .force("link", d3.forceLink().id(function(d, i) { return i;}).distance(20).strength(0.9))
      .force("center", d3.forceCenter(width/2, height/2))
      .force('X', d3.forceX(width/2).strength(0.15)) // retuirnx 100 d,group
      .force('Y', d3.forceY(height/2).strength(0.15));

  var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")

  var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
      .attr("id", function(d, i) { return 'c'+i})
      .attr("r",function(d) {
            if(d.group==0) {return 40}
            else{
              return radius}
            })
      .style("fill", function(d) {
            if(d.group==0) {return "url(#vit-icon)";}
            else {return color(d.group); }
          })
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

    node.on("click", function(d, i) {
      if(d.group==0) return;
      if(d3.select(this).attr("r") == radius){
        addNodes(d)

          d3.select(this).attr("r", radius * 2);
        }else{
          d3.select(this).attr("r", radius);
        }
        ticked()
    })

    node.on("mouseover", function(d, i){
      // find all the nodes connected to this one
      console.log(i);
      console.log(d);
      d3.select(this).style("stroke", "red");
      link.style('stroke', function(l) {

        if (d === l.source || d === l.target)
          return '#FF0000';
        });
      return   tooltip.style("visibility", "visible")
               .attr("class", 'tooltip')
               .text(d.text);
    })
    node.on("mouseout", function(d){
      d3.select(this).style("stroke", "#fff");

            link.style('stroke', function(l){
              return '#999'})
            return tooltip.style("visibility", "hidden");
    });
    node.on("mousemove", function(){return tooltip.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+20)+"px");})


    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("a simple tooltip");

    simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

    simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) {return d.source.x; })
        .attr("y1", function(d) {return d.source.y; })
        .attr("x2", function(d) {return d.target.x; })
        .attr("y2", function(d) {return d.target.y; })

        node
            .attr("transform", function(d) {
                return "translate(" + d.x + ", " + d.y + ")";
            });
  }

  function dragstarted(d) {
      if(!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
  }
  function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
  }
  function dragended(d) {
      if(!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
  }

  function addNodes(node) { // IF tags are not on, and new nodes are added, how to have nodes be consistent with this?

  if(node.group == 5) {
      var tags = node.tags[0];
      var refs = node.reference;
      var year = '';
  if(node.year>1) year = node.year;
      dataList.innerHTML += '<li> <p class="datum">'+node.text+'</p> <p class="tags">('+tags+')</> <p class="refs">['+refs+'] '+year+' </p></li>'
    }
  }
})





});
