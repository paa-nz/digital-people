function toggleSwitch(switched) {
  var elements = document.getElementsByClassName(switched)
  if(!elements[0].classList.contains('hidden')) {
    for(var i =0; i<elements.length; i++){
      elements[i].classList.add('hidden');
    }
  }
  else {
    for(var i =0; i<elements.length; i++){
      elements[i].classList.remove('hidden');
    }
  }
}

function linkMouseover(d){
  chart.selectAll(".node").classed("active", function(p) {
    return d3.select(this).classed("active") || p === d.source || p === d.target; });
          }
// Highlight the node and connected links on mouseover.
function nodeMouseover(d) {
 chart.selectAll(".link").classed("active", function(p) {
   return d3.select(this).classed("active") || p.source === d || p.target === d; });
            chart.selectAll(".link.active").each(function(d){linkMouseover(d)})
            d3.select(this).classed("active", true);
  }
