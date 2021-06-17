const div = document.getElementById('fingerprint')
const rect = div.getBoundingClientRect()
const x = rect.left
const y = rect.top
const width = rect.width
const height = rect.height
const radius = width / 1.665

const stratify = d3.cluster().size([2 * Math.PI, radius - 100])

const idColors = [
  '#4EA8BA',
  '#4EA8BA',
  '#46AAB3',
  '#7B9FE3',
  '#9A99FF',
  '#65A4CF',
]
const idNames = [
  'self-ethicist',
  'others-ethicist',
  'paid work',
  'years in field',
  'education',
  'career path',
]

const themeColors = [
  '#CB9AC6',
  '#FDCC9A',
  '#B668AA',
  '#D66B6E',
  '#DC9AA2',
  '#8B6BAA',
  '#EB9C84',
  '#CB9AC6',
]
const themeNums = [0, 1, 2, 3, 12, 23, 13, 123]
const themeNames = [
  'topics',
  'domain',
  'outputs',
  'audiences',
  'collab type',
  'collab field',
]

const colID = d3.scaleOrdinal().domain(idNames).range(idColors)
const colTHEME = d3.scaleOrdinal().domain(themeNums).range(themeColors)

// dendro :: (Object, Boolean) -> undefined
export function dendro(data, init) {
  let svg
  if (init) {
    svg = d3
      .selectAll('.fingerprint-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + radius / 1.2 + ')')
  } else {
    svg = d3.selectAll('.fingerprint-container').selectAll('svg').selectAll('g')
  }
  const [dataFirst, dataSecond, ignoreMe] = data.children
  const dataSlim = { ...data, children: [dataFirst, dataSecond] }
  const sortData = d3.hierarchy(dataSlim)
  const root = stratify(sortData)

  // Gray section drawing
  if (init) {
    svg
      .append('g')
      .attr('fill', 'none')
      .attr('class', 'thedraw')
      .selectAll('path')
      .data(root.links())
      .join('path')
      .attr('class', 'drawing')
      .attr('stroke-width', function (d) {
        if (d.target.data.value != undefined && d.target.data.value < 1) {
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
          for (let i = 0; i < idNames.length; i++) {
            if (d.source.data.name == idNames[i]) {
              return colID(d.source.data.name)
            }
          }
          for (let j = 0; j < idNames.length; j++) {
            if (d.source.data.name == themeNames[j]) {
              return colTHEME(d.target.data.value)
            }
          }
        } else {
          return 'lightgrey'
        }
      })
  } else {
    svg
      .selectAll('g.thedraw')
      .selectAll('path')
      .data(root.links())
      .join('path')
      .attr('class', 'drawing')
      .attr('stroke-width', function (d) {
        if (d.target.data.value != undefined && d.target.data.value < 1) {
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
          for (let i = 0; i < idNames.length; i++) {
            if (d.source.data.name == idNames[i]) {
              return colID(d.source.data.name)
            }
          }
          for (let j = 0; j < idNames.length; j++) {
            if (d.source.data.name == themeNames[j]) {
              return colTHEME(d.target.data.value)
            }
          }
        } else {
          return 'lightgrey'
        }
      })
  }

  // remove old ones
  svg.selectAll('g').selectAll('circle').remove()

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

  // write text on initial
  if (init) {
    svg
      .append('g')
      // .attr("font-family", "sans-serif")
      .attr('font-size', 10)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width', 3)
      .selectAll('text')
      .data(root.descendants())
      .join('text')
      .filter(function (d) {
        return d.children
      })
      .attr('class', 'dendroText')
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
      })
      .text((d) => d.data.name)
      .clone(true)
      .lower()
    // .attr("stroke", "white");
  }
}

d3.selectAll('.dendro-labels-on').on('click', function () {
  d3.selectAll('.dendroText').transition().attr('fill', 'white')
})
d3.selectAll('.dendro-labels-off').on('click', function () {
  d3.selectAll('.dendroText').transition().attr('fill', 'none')
})
