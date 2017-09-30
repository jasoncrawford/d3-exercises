window.charts = window.charts || {};
let charts = window.charts;

charts.barChart = function (selector) {
  let data = [1, 1, 2, 3, 5, 8, 13];

  const barHeight = 400;
  const barWidth = 36;
  const padding = 8;
  const margin = 10;
  const lineHeight = 20;
  const labelHeight = 20;

  const barDuration = 300;
  const labelDuration = 200;
  const barDelay = 20;

  const nYears = 25;

  let draw = data => {
    let width = data.length * (barWidth + padding);
    let height = barHeight + 2 * labelHeight;

    let scaleY = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.patents)])
      .range([0, barHeight])

    let formatter = d3.formatPrefix('.0', 1e3)

    let svg = d3.select(selector).append('svg')
      .classed('bar-chart', true)
      .attr('width', width + 2 * margin)
      .attr('height', height + 2 * margin)

    let content = svg.append('g')
      .attr('transform', `translate(${margin}, ${margin})`)

    content.append('text')
      .classed('header', true)
      .attr('x', 0)
      .attr('y', lineHeight)
      .text(`US utility patents, ${data[0].year} to ${data[data.length-1].year}`)

    content.append('a')
      .attr('href', 'https://www.datazar.com/file/f698590f4-2d24-4de4-918c-a198690bba2a')
      .attr('target', '_blank')
      .append('text')
        .attr('x', 0)
        .attr('y', 2 * lineHeight)
        .text('Source: Datazar')

    let selection = content.selectAll('rect').data(data);

    let groups = selection.enter().append('g')
      .classed('bar-group', true)

    groups.append('rect')
      .classed('bar', true)
      .attr('x', (d, i) => i * (barWidth + padding))
      .attr('width', barWidth)
      .attr('y', d => labelHeight + barHeight)
      .attr('height', 0)
      .transition()
        .delay((d, i) => i * barDelay)
        .duration(barDuration)
        .attr('y', d => labelHeight + barHeight - scaleY(d.patents))
        .attr('height', d => scaleY(d.patents))

    groups.append('text')
      .classed('label', true)
      .attr('x', (d, i) => i * (barWidth + padding) + (barWidth / 2))
      .attr('y', height)
      .attr('text-anchor', 'middle')
      .text(d => d.year)

    groups.append('text')
      .classed('label', true)
      .attr('x', (d, i) => i * (barWidth + padding) + (barWidth / 2))
      .attr('y', d => labelHeight + barHeight - scaleY(d.patents) - padding)
      .attr('text-anchor', 'middle')
      .text(d => formatter(d.patents))
      .style('opacity', 0)
      .transition()
        .delay((d, i) => barDuration - labelDuration + i * barDelay)
        .duration(labelDuration)
        .style('opacity', 1)
  }

  let transform = d => ({year: d['Calendar Year'], patents: +d['Utility Patents']})

  d3.csv('data/us-patents.csv', transform, data => {
    data = data.slice(0, nYears).reverse();
    draw(data);
  })
}
