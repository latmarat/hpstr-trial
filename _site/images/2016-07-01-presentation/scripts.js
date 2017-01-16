function plotLDR(data) {
  // Variables
  //console.log(myurl)
  var body = d3.select('div#left')
  var margin = { top: 50, right: 50, bottom: 50, left: 50 }
  var h = 500 - margin.top - margin.bottom
  var w = 500 - margin.left - margin.right
  var formatFloat = d3.format('.2f')
  // Scales
  var colorScale = d3.scale.category20()
  var colors = d3.scale.linear()
    .domain([
      d3.min(data.GrainSize, function (d) { return d[0] }),
      d3.max(data.GrainSize, function (d) { return d[0] })
      ])
    .range(['#ffffff','#ff0045'])
    var rScale = d3.scale.linear()
      .domain([
        d3.min(data.CI, function (d) { return d[0] }),
        d3.max(data.CI, function (d) { return d[0] })
        ])
      .range([3,12])
  var xScale = d3.scale.linear()
    .domain([
      1.1*d3.min(data.PC1, function (d) { return d[0] }),
      1.1*d3.max(data.PC1, function (d) { return d[0] })
      ])
    .range([0,w])
  var yScale = d3.scale.linear()
    .domain([
      1.1*d3.min(data.PC2, function (d) { return d[0] }),
      1.1*d3.max(data.PC2, function (d) { return d[0] })
      ])
    .range([h,0])
  // SVG
  var svg1 = body.append('svg')
      .attr("id","svg_1")
	    .attr('height',h + margin.top + margin.bottom)
	    .attr('width',w + margin.left + margin.right)
	  .append('g')
	    .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
  var svg2 = d3.select("div#right").append("svg")
      .attr("id","svg_2")
      .attr('height',h + margin.top + margin.bottom)
	    .attr('width',w + margin.left + margin.right)
  var p = d3.select("div#author").append("p")
        .attr("id","p_author")
        //.attr('width',w + margin.left + margin.right)
  var a = d3.select("div#link").append("a")
        .attr("id","p_link")
        //.attr('width',w + margin.left + margin.right)

  // X-axis
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .tickFormat(formatFloat)
    .ticks(5)
    // .orient('bottom')
  // Y-axis
  var yAxis = d3.svg.axis()
    .scale(yScale)
    .tickFormat(formatFloat)
    .ticks(5)
    .orient('left')
  // Circles
  // console.log(data[0].PC1)
  var circles = svg1.selectAll('circle')
      .data(data.GrainSize)
      .enter()
    .append('circle')
      .attr('cx',function (d,i) { return xScale(data.PC1[i])})
      .attr('cy',function (d,i) { return yScale(data.PC2[i])})
      .attr('r',function (d,i)  { return rScale(data.CI[i]) })
      .attr('stroke','black')
      .attr('stroke-width',1)
      .attr('fill',function (d,i) { return colors(d) })
      .style('opacity', 0.7)
      .on('mouseover', function () {
        d3.select(this)
          // .transition()
          // .duration(500)
          // .attr('r',function (d,i) { return rScale(2.0*data.CI[i]) })
          .attr('stroke-width',3)
          .style('opacity', 1.0)
      })
      .on('click', function (d, i) {
        d3.select(this)
        displayEBSD(i,margin,h,w,data)
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(500)
          // .attr('r',function (d,i) { return rScale(data.CI[i]) })
          .attr('stroke-width',1)
          .style('opacity', 0.5)
      })
    .append('title') // Tooltip
      .text(function (d,i) { return 'Material: ' + data.phase[i] +
                          '\nGrain Size: ' + formatFloat(d) + ' um'})
                          // '\nAuthor: ' + data.author[i] })
                          //  '\nPC 2: ' + formatFloat(d.PC2) +
                          //  '\nPC 3: ' + formatFloat(d.PC3) })
  // X-axis
  svg1.append('g')
      .attr('class','axis')
      .attr('transform', 'translate(0,' + h + ')')
      .call(xAxis)
    .append('text') // X-axis Label
      .attr('class','label')
      .attr('y',-10)
      .attr('x',w)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text('PC 1')
  // Y-axis
  svg1.append('g')
      .attr('class', 'axis')
      .call(yAxis)
    .append('text') // y-axis Label
      .attr('class','label')
      .attr('transform','rotate(-90)')
      .attr('x',0)
      .attr('y',5)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text('PC 2')
}

function displayEBSD(i,margin,h,w,data) {

  d3.select("#ebsd").remove()

  var getUrl = window.location;
  var baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
  console.log(baseUrl)

  var imgname = baseUrl + '/images/2016-07-01-presentation/img/ebsd/ebsd-' + (i+1) + '.png'
  console.log(imgname)

  var svg = d3.select("#svg_2")

  d3.select("#p_author")
    .text("Authors: " + data.author[i])
    .style("font-size","26px");
  d3.select("#p_link")
    // .attr("xlink:href", data.link[i])

    .text("\nPublication: " + data.linkText[i])
    .style("font-size","26px")
    .on('click', function () {window.open(data.link[i]); });


  var img = svg.append("svg:image")
      .attr("id",'ebsd')
      .attr("xlink:href", imgname)
      .attr("width", w)
      .attr("height", h)
      .attr("x", 0)
      .attr("y",margin.top);
}
