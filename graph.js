document.addEventListener("DOMContentLoaded", function(event) {
var d3 = require("d3");

var graph
var radius = 6;
//Append a SVG to the body of the html page. Assign this SVG as an object to svg
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory20b);


d3.json("./x.json", function(json) {
  var graph = json
      console.log(graph);
      console.log(graph.nodes);

      var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d, i) {
        return i;
      }).distance(50))
      .force("charge", d3.forceManyBody().strength(-5))
      .force("center", d3.forceCenter(width/2, height/2));

  var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    //.attr("stroke-width", function(d) {return 0.5 });

  var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
      .attr("r", 5)
      .attr("fill", function(d) { return color(d.group); })
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

    node.append("title")
      .text(function(d) {return d.text });

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
        .attr("cx", function(d) {return d.x  })
        .attr("cy", function(d) {return d.y; });
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
})
});
