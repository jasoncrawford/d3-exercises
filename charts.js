window.charts = window.charts || {};
let charts = window.charts;

charts.barChart = function (selector) {
  let svg = d3.select(selector).append('svg')
    .classed('bar-chart', true)
    .attr('width', 640)
    .attr('height', 480)

  svg.append('rect')
    .classed('bar', true)
    .attr('x', 10)
    .attr('y', 10)
    .attr('width', 20)
    .attr('height', 100)
}
