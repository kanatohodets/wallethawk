define(function (require, exports, module) {
  var d3 = require('d3');

  module.exports = function (el) {
    var self = {};
    self.render = function (root) {
      var width = 960,
          height = 700,
          radius = Math.min(width, height) / 2;

      var x = d3.scale.linear()
          .range([0, 2 * Math.PI]);

      var y = d3.scale.linear()
          .range([0, radius]);

      var xRect = d3.scale.linear()
          .range([0, width]);
      var yRect = d3.scale.linear()
          .range([0, height]);

      var color = d3.scale.category20c();

      var svg = d3.select(el).append("svg")
          .attr("width", width)
          .attr("height", height)
        .append("g")
          .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

      var partition = d3.layout.partition()
          .value(function(d) { return d.size; });

      var arc = d3.svg.arc()
          .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
          .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
          .innerRadius(function(d) { return Math.max(0, y(d.y)); })
          .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

      var g = svg.selectAll("g")
          .data(partition.nodes(root))
        .enter().append("g");

      var path = g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
        .style("stroke", "#fff")
        .style("fill-rule", "evenodd")
        .on("click", click);

      var textGroup = g.append("text")
        .attr("class", "foobar")
        .attr("transform", function(d) {
          return "rotate(" + computeTextRotation(d) + ")";
        })
        .attr("x", function(d) { return y(d.y); })
        .attr("dx", "6") // margin
        .attr("dy", ".35em") // vertical-align
        .append("tspan")
        .style("pointer-events", "none")
        .text(function (d) {
          if (d.depth) {
            return d.name;
          }
          return '';
        })
        .on("click", click);

      textGroup
        .append("tspan")
        .attr("dy", "1em")
        .attr("dx", function (d) {
          return (-1 * d.name.length / 3) + "em";
        })
        .text(function (d) {
          if (d.depth) {
            return "$" + d.value;
          }
          return '';
        });



      function click(d) {
        // fade out all text elements
        textGroup.transition().attr("opacity", 0);
        textGroup.transition().attr("fill-opacity", 0);

        path.transition()
          .duration(750)
          .attrTween("d", arcTween(d))
          .each("end", function(e, i) {
              // check if the animated element's data e lies within the visible angle span given in d
              if (e.x >= d.x && e.x < (d.x + d.dx)) {
                // get a selection of the associated text element
                var arcText = d3.select(this.parentNode).select("text.foobar");
                // fade in the text element and recalculate positions
                arcText.transition().duration(750)
                  .attr("opacity", 1)
                  .attr("fill-opacity", 1)
                  .attr("hidden", null)
                  .attr("transform", function (e) {
                    return "rotate(" + computeTextRotation(e) + ")";
                  })
                  .attr("x", function(d) { return y(d.y); });
                var arcTspan = d3.select(this.parentNode).select("tspan");
                arcTspan.transition().duration(750)
                  .attr("opacity", 1)
                  .attr("fill-opacity", 1);
              }
          });
      }

      d3.select(self.frameElement).style("height", height + "px");

      // Interpolate the scales!
      function arcTween(d) {
        var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
            yd = d3.interpolate(y.domain(), [d.y, 1]),
            yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
        return function(d, i) {
          return i
              ? function(t) { return arc(d); }
              : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
        };
      }

      function computeTextRotation(d) {
        return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
      }

    };
    return self;
  };
});
