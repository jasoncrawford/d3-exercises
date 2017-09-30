window.charts = window.charts || {};
let charts = window.charts;

charts.barChart = function (selector) {
  let svg = d3.select(selector).append('svg')
    .attr('width', 640)
    .attr('height', 480)

  svg.append('text')
    .attr('x', 10)
    .attr('y', 30)
    .text('hello, world!')
}
