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

    let selection = content.selectAll('g.bar-group').data(data);

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

charts.globe = function (selector) {
  const radius = 250;
  const diameter = 2 * radius;
  const margin = 20;

  let svg = d3.select(selector).append('svg')
    .classed('globe', true)
    .attr('width', diameter + 2 * margin)
    .attr('height', diameter + 2 * margin)

  let content = svg.append('g')
    .attr('transform', `translate(${margin}, ${margin})`)

  const url = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

  d3.json(url, data => {
    const tilt = -15;

    let projection = d3.geoOrthographic()
      .translate([radius, radius])
      .rotate([0, tilt])

    content.append('circle')
      .classed('sphere', true)
      .attr('cx', radius)
      .attr('cy', radius)
      .attr('r', radius)

    let graticulePath = content.append('path')
      .classed('graticule', true)
      .datum(d3.geoGraticule())
      .attr('d', d3.geoPath(projection))

    let countryPath = content.append('path')
      .classed('country-path', true)
      .datum(data)
      .attr('d', d3.geoPath(projection))

    let dragStart = null;
    let rotStart = null;

    svg.on('mousedown', function () {
      dragStart = d3.mouse(this);
      rotStart = projection.rotate();
    });

    svg.on('mousemove', function () {
      if (!dragStart) return;
      let current = d3.mouse(this);
      let dx = current[0] - dragStart[0];
      let degrees = dx * 0.25;
      projection.rotate([rotStart[0] + degrees, tilt]);

      graticulePath.attr('d', d3.geoPath(projection));
      countryPath.attr('d', d3.geoPath(projection));
    })

    svg.on('mouseup', function () {
      dragStart = null;
      rotStart = null;
    })
  })
}

charts.scatterPlot = function (selector) {
  const width = 600;
  const height = 600;
  const margin = {top: 80, right: 20, bottom: 30, left: 40};

  const yearStart = 1950;
  const yearEnd = 2008;
  let years = d3.range(yearEnd, yearStart - 1, -1);

  let svg = d3.select(selector).append('svg')
    .classed('scatter-plot', true)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)

  let scaleYear = d3.scaleLinear()
    .domain([yearStart, yearEnd])
    .range([0, width])

  let yearAxis = d3.axisTop(scaleYear).tickFormat(d3.format('0'));
  let yearSlider = svg.append('g')
    .attr('transform', `translate(${margin.left}, 40)`);

  yearSlider.call(yearAxis)
  let handle = yearSlider.append('circle')
    .classed('slider-handle', true)
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 5)

  let content = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  let scaleX, scaleY;
  let setScaleAndAxes = () => {
    let allPoints = d3.merge(d3.values(dataByYear).map(byCountry => d3.values(byCountry)));
    allPoints = allPoints.filter(d => !isNaN(d.life) && !isNaN(d.gdp));
    let lifeValues = allPoints.map(d => d.life);
    let gdpValues = allPoints.map(d => d.gdp);

    scaleX = d3.scaleLinear()
      .domain([d3.min(lifeValues), d3.max(lifeValues)])
      .range([0, width])
      .nice()

    scaleY = d3.scaleLinear()
      .domain([d3.min(gdpValues), d3.max(gdpValues)])
      .range([height, 0])
      .nice()

    let xAxis = d3.axisBottom(scaleX);
    let yAxis = d3.axisLeft(scaleY).tickFormat(d3.format('$.0s'));

    content.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    content.append('g').call(yAxis);
  }

  let lastYearDrawn = null;
  let draw = () => {
    let year = parseInt(scaleYear.invert(handle.attr('cx')));
    if (year === lastYearDrawn) return;
    lastYearDrawn = year;

    data = d3.values(dataByYear[year]);
    data = data.filter(d => !isNaN(d.life) && !isNaN(d.gdp));

    let selection = content.selectAll('circle.point')
      .data(data);

    selection.enter().append('circle')
      .classed('point', true)
      .attr('cx', d => scaleX(d.life))
      .attr('cy', d => scaleY(d.gdp))
      .attr('r', 5)
      .on('mouseover', function (d, i) {
        content.append('text')
          .classed('label', true)
          .attr('x', scaleX(d.life))
          .attr('y', scaleY(d.gdp) - 12)
          .attr('text-anchor', 'middle')
          .text(d.name)
      })
      .on('mouseout', function (d, i) {
        content.selectAll('text.label').remove();
      })

    selection.transition()
      .attr('cx', d => scaleX(d.life))
      .attr('cy', d => scaleY(d.gdp))

    selection.exit().remove();
  }

  handle.call(d3.drag().on('drag', () => {
    let x = d3.event.x;
    if (x < 0 || x > width) return;
    d3.select('.slider-handle').attr('cx', x);
    draw();
  }))

  // Ultimate format will be like:
  //
  // dataByYear = {
  //   '2010': {
  //     'Albania': {life: ..., gdp: ...}
  //   }
  // }
  let dataByYear = {};

  let q = d3.queue();

  q.defer(done => {
    d3.csv('data/life-expectancy.csv',
      row => ({
        key: row['Code'],
        name: row['Entity'],
        year: +row['Year'],
        life: +row['Life Expectancy at Birth (both genders)']
      }),
      data => {
        data.forEach(row => {
          if (!row.year || !row.name || !row.life) return;
          if (row.year < yearStart || row.year > yearEnd) return;

          let byYear = dataByYear[row.year];
          if (!byYear) byYear = dataByYear[row.year] = {};

          let country = byYear[row.name];
          if (!country) country = byYear[row.name] = {};

          country.name = row.name;
          if (!isNaN(row.life)) country.life = row.life;
        })
        done();
      },
    )
  })

  q.defer(done => {
    d3.csv('data/gdp.csv', data => {
      data.forEach(row => {
        let year = +row['Year'];
        if (!year || isNaN(year) || year < yearStart || year > yearEnd) return;

        let byYear = dataByYear[year];
        if (!byYear) byYear = dataByYear[year] = {};

        d3.entries(row).forEach(entry => {
          if (!entry.key || !entry.value) return;
          if (entry.key === 'Year') return;
          let name = entry.key.trim();
          if (name === 'Qatar' || name === 'Kuwait') return;  // These two are GDP outliers

          let country = byYear[name];
          if (!country) country = byYear[name] = {};

          country.name = name;

          let gdp = +(entry.value.replace(/,/g, ''));
          if (!isNaN(gdp)) country.gdp = gdp;
        })
        done();
      })
    })
  })

  q.await(() => {
    setScaleAndAxes();
    draw();
  })
}
