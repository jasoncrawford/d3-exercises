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
  const textHeight = 18.5;

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

  let draw = data => {
    let scaleY = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.patents)])
      .range([0, innerHeight])

    content.append('text')
      .attr('x', 0)
      .attr('y', textHeight)
      .text(`US utility patents, ${data[0].year} to ${data[data.length-1].year}`)

    content.append('a')
      .attr('href', 'https://www.datazar.com/file/f698590f4-2d24-4de4-918c-a198690bba2a')
      .attr('target', '_blank')
      .append('text')
        .attr('x', 0)
        .attr('y', 2 * textHeight)
        .text('Source: Datazar')

    content.selectAll('rect').data(data)
      .enter().append('rect')
        .classed('bar', true)
        .attr('x', (d, i) => i * (barSize + padding))
        .attr('y', d => innerHeight - scaleY(d.patents))
        .attr('width', barSize)
        .attr('height', d => scaleY(d.patents))
  }

  let transform = d => ({year: d['Calendar Year'], patents: +d['Utility Patents']})

  d3.csv('data/us-patents.csv', transform, data => {
    data = data.slice(0,25).reverse();
    draw(data);
  })
}
