window.charts = window.charts || {};
let charts = window.charts;

const chartWidth = 640;
const chartHeight = 480;

charts.barChart = function (selector) {
  let data = [1, 1, 2, 3, 5, 8, 13];

  const barSize = 20;
  const padding = 2;
  const scale = 10;

  let svg = d3.select(selector).append('svg')
    .classed('bar-chart', true)
    .attr('width', chartWidth)
    .attr('height', chartHeight)

  svg.selectAll('rect').data(data)
    .enter().append('rect')
      .classed('bar', true)
      .attr('x', (d, i) => i * (barSize + padding))
      .attr('y', d => chartHeight - d * scale)
      .attr('width', barSize)
      .attr('height', d => d * scale)
}
