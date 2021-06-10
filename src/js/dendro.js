// read json data
d3.json('./data/data.json').then(function (data) {
  // set the dimensions and margins of the graph

  var div = document.getElementById('fingerprint-container')
  var rect = div.getBoundingClientRect()
  x = rect.left
  y = rect.top
  width = rect.width
  height = rect.height
  var radius = width / 1.5

  var svg = d3
    .select('#fingerprint-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + radius + ')')

  var stratify = d3.cluster().size([2 * Math.PI, radius - 100])

  var idColors = [
    '#4EA8BA',
    '#4EA8BA',
    '#46AAB3',
    '#7B9FE3',
    '#9A99FF',
    '#65A4CF',
  ]
  var idNames = [
    'self-ethicist',
    'others-ethicist',
    'paid work',
    'years in field',
    'education',
    'career path',
  ]

  var themeColors = [
    '#CB9AC6',
    '#FDCC9A',
    '#B668AA',
    '#D66B6E',
    '#DC9AA2',
    '#8B6BAA',
    '#EB9C84',
    '#CB9AC6',
  ]
  var themeNums = [0, 1, 2, 3, 12, 23, 13, 123]
  var themeNames = [
    'topics',
    'domain',
    'outputs',
    'audiences',
    'collab type',
    'collab field',
  ]

  var colID = d3.scaleOrdinal().domain(idNames).range(idColors)
  var colTHEME = d3.scaleOrdinal().domain(themeNums).range(themeColors)

  var sdata
  data.children.pop()
  sortData = d3.hierarchy(data)

  var root = stratify(sortData)

  svg
    .append('g')
    .attr('fill', 'none')
    .attr('class', 'thedraw')
    .selectAll('path')
    .data(root.links())
    .join('path')
    .attr('class', 'drawing')
    .attr('stroke-width', function (d) {
      if (
        d.target.data.value != undefined &&
        d.target.data.value != 1 &&
        d.target.data.value != 2 &&
        d.target.data.value != 3 &&
        d.target.data.value != 12
      ) {
        return 1
      } else {
        return 1.5
      }
    })
    .attr(
      'd',
      d3
        .linkRadial()
        .angle(function (d) {
          return d.x
        })
        .radius(function (d) {
          return d.y
        })
    )
    .attr('stroke-opacity', function (d) {
      if (d.target.data.value > 0) {
        return 1
      } else {
        return 0.5
      }
    })
    .attr('stroke', function (d) {
      if (d.target.data.value >= 0) {
        for (i = 0; i < idNames.length; i++) {
          if (d.source.data.name == idNames[i]) {
            return colID(d.source.data.name)
          }
        }
        for (j = 0; j < idNames.length; j++) {
          if (d.source.data.name == themeNames[j]) {
            return colTHEME(d.target.data.value)
          }
        }
      } else {
        return 'lightgrey'
      }
    })

  svg
    .append('g')
    .selectAll('circle')
    .data(root.descendants())
    .join('circle')
    .filter(function (d) {
      return d.data.value > 0
    })
    .attr(
      'transform',
      (d) => `
          rotate(${(d.x * 180) / Math.PI - 90})
          translate(${d.y},0)
        `
    )
    .attr('fill', 'white')
    .attr('opacity', 0.7)
    .attr('r', 2.5)
    .attr('class', function (d) {
      return d.data.name
    })

  svg
    .append('g')
    // .attr("font-family", "sans-serif")
    .attr('font-size', 8)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-width', 3)
    .selectAll('text')
    .data(root.descendants())
    .join('text')
    .filter(function (d) {
      // return 0;
      return d.children //d.data.value>0 ||
    })
    .attr('class','dendroText')
    .attr(
      'transform',
      (d) => `
          rotate(${(d.x * 180) / Math.PI - 90}) 
          translate(${d.y},0) 
          rotate(${d.x >= Math.PI ? 180 : 0})
        `
    )
    .attr('dy', '0.31em')
    // .attr("dy", "-0.9em")
    .attr('x', (d) => (d.x < Math.PI === !d.children ? 6 : -6))
    .attr('text-anchor', (d) =>
      d.x < Math.PI === !d.children ? 'start' : 'end'
    )
    .attr('fill', function (d) {
      if (d.children) {
        return 'none'
      }
      // if(!d.children){
      // return "lightgrey"
      // }
      // return "none";
    })
    .text((d) => d.data.name)
    .clone(true)
    .lower()
  // .attr("stroke", "white");

  d3.select('#dendro-labels-on').on('click', function () {
    d3.selectAll('.dendroText').transition().attr('fill', 'white')
  })
  d3.select('#dendro-labels-off').on('click', function () {
    d3.selectAll('.dendroText').transition().attr('fill', 'none')
  })
})
