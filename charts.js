window.charts = window.charts || {};
let charts = window.charts;

const chartWidth = 640;
const chartHeight = 480;

charts.barChart = function (selector) {
  let data = [1, 1, 2, 3, 5, 8, 13];

  const barSize = 20;
  const padding = 2;
  const margin = 10;
  const scale = 10;

  let innerWidth = chartWidth - 2 * margin;
  let innerHeight = chartHeight - 2 * margin;

  let svg = d3.select(selector).append('svg')
    .classed('bar-chart', true)
    .attr('width', chartWidth)
    .attr('height', chartHeight)

  let content = svg.append('svg')
    .attr('x', margin)
    .attr('y', margin)
    .attr('width', innerWidth)
    .attr('height', innerHeight)

  let scaleY = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([0, innerHeight])

  content.selectAll('rect').data(data)
    .enter().append('rect')
      .classed('bar', true)
      .attr('x', (d, i) => i * (barSize + padding))
      .attr('y', d => innerHeight - scaleY(d))
      .attr('width', barSize)
      .attr('height', scaleY)
}
