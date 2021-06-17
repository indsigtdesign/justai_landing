const div = document.getElementById('wheel-container')
const { width, height } = div.getBoundingClientRect()

const leftMargin = 100
const topMargin = leftMargin
let tooltip = d3.select('#tooltip')
    .style('opacity', 0);
// wheel :: (Object, Boolean) -> undefined
export function wheel(data, init) {
  d3.select('#wheel-container').selectAll('svg').remove()

  let svg = d3
    .select('#wheel-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])

  let g = svg.append('g')

  const figDepth = 2
  const paddingX = width / 15
  const paddingY = height / 14

  const centerEX = width / 2 - paddingX * 2.2
  const centerEH = height / figDepth

  const innerCircRad = width / 40
  const smallMarg = innerCircRad / 2
  //CHANGES HERE: CAREFUL!
  const maxRad = 40 // (height/10);
  const minRad = 7.5
  const maxBar = minRad * 4

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
  const strokeHighlight = 0.5
  const strokeNormal = 0.2
  const strokeMin = 0.2

  const colID = d3.scaleOrdinal().domain(idNames).range(idColors)
  const colTHEME = d3.scaleOrdinal().domain(themeNums).range(themeColors)
  const posID = [
    {
      x: centerEX + paddingX + smallMarg * 2,
      y: centerEH - paddingY - smallMarg,
      rot: 15,
      id: 'self-ethicist',
    },
    {
      x: centerEX + paddingX - smallMarg,
      y: centerEH - paddingY - smallMarg * 3,
      rot: 350,
      id: 'others-ethicist',
    },
    {
      x: centerEX + paddingX + smallMarg * 2,
      y: centerEH - smallMarg,
      rot: 80,
      id: 'paid work',
    },
    {
      x: centerEX - paddingX / 2,
      y: centerEH + paddingY / 2 - smallMarg,
      rot: 180,
      id: 'years in field',
    },
    {
      x: centerEX + paddingX * 2,
      y: centerEH + paddingY,
      rot: 80,
      id: 'education',
    },
    {
      x: centerEX - paddingX / 2,
      y: centerEH - paddingY - smallMarg * 3,
      rot: 250,
      id: 'career path',
    },
  ]
  const posTh = [
    {
      x: centerEX + paddingX * 3,
      y: centerEH - paddingY - smallMarg * 3,
      rot: 300,
      id: 'topics',
    },
    {
      x: centerEX + paddingX * 3 + smallMarg,
      y: centerEH - paddingY - smallMarg,
      rot: 80,
      id: 'domain',
    },
    {
      x: centerEX + paddingX * 4.5,
      y: centerEH + paddingY / 2,
      rot: 65,
      id: 'outputs',
    },
    {
      x: centerEX + paddingX * 4.9,
      y: centerEH + paddingY / 2 + maxBar * 1.5,
      rot: 70,
      id: 'audiences',
    },
    {
      x: centerEX + paddingX * 4.6,
      y: centerEH - paddingY - smallMarg * 4,
      rot: 300,
      id: 'collab type',
    },
    {
      x: centerEX + paddingX * 5,
      y: centerEH - paddingY - smallMarg * 3,
      rot: 40,
      id: 'collab field',
    },
  ]

  const idLine = [posID[5], posID[1], posID[0], posID[2], posID[4]]
  const themeLine = [posTh[5], posTh[4], posTh[0], posTh[1], posTh[2], posTh[3]]
  const cnctLine = [posID[0], posTh[0]]
  const yearLine = [posID[3], posID[0]]
  const originX = 0
  const originY = 0

  const idVals = []
  const theVals = []
  let maxTotal = 0
  let maxTheme
  let maxId = 0
  const barScale = d3.scaleLinear().domain([0, maxTotal]).range([1, maxBar])

  const yearsMax = 52
  const yearScale = d3.scaleLinear().domain([0, yearsMax]).range([0, 360])

  const widthScale = d3.scaleLinear().domain([0, 100]).range([5, 0.5])

  // const radiusScale = d3.scaleLinear()
  // 	.domain([2, 52])
  // 	.range([innerCircRad/2, outerCircleRadius])
  const radiusScale = d3.scaleLinear().domain([2, 52]).range([minRad, maxRad])

  const barwide = 3
  const barSpaceSm = minRad + 2
  const barSpace = 3

  const barSpaceEd = 3
  const barSpaceCo = 4
  const barSpaceCa = 6
  const barSpaceCd = 5
  const barSpaceTo = minRad

  const yearsRadius = maxRad / 1.8
  let lengths = []
  const ft = 8

  function measureText(string, fontSize = ft) {
    const widths = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0.278125, 0.278125, 0.35625, 0.55625, 0.55625,
      0.890625, 0.6671875, 0.1921875, 0.334375, 0.334375, 0.390625, 0.584375,
      0.278125, 0.334375, 0.278125, 0.303125, 0.55625, 0.55625, 0.55625,
      0.55625, 0.55625, 0.55625, 0.55625, 0.55625, 0.55625, 0.55625, 0.278125,
      0.278125, 0.5859375, 0.584375, 0.5859375, 0.55625, 1.015625, 0.6671875,
      0.6671875, 0.7234375, 0.7234375, 0.6671875, 0.6109375, 0.778125,
      0.7234375, 0.278125, 0.5, 0.6671875, 0.55625, 0.834375, 0.7234375,
      0.778125, 0.6671875, 0.778125, 0.7234375, 0.6671875, 0.6109375, 0.7234375,
      0.6671875, 0.9453125, 0.6671875, 0.6671875, 0.6109375, 0.278125, 0.35625,
      0.278125, 0.478125, 0.55625, 0.334375, 0.55625, 0.55625, 0.5, 0.55625,
      0.55625, 0.278125, 0.55625, 0.55625, 0.2234375, 0.2421875, 0.5, 0.2234375,
      0.834375, 0.55625, 0.55625, 0.55625, 0.55625, 0.334375, 0.5, 0.278125,
      0.55625, 0.5, 0.7234375, 0.5, 0.5, 0.5, 0.35625, 0.2609375, 0.3546875,
      0.590625,
    ]
    const avg = 0.5293256578947368
    return (
      string
        .split('')
        .map((c) =>
          c.charCodeAt(0) < widths.length ? widths[c.charCodeAt(0)] : avg
        )
        .reduce((cur, acc) => acc + cur) * fontSize
    )
  }
  let sdata = data.children

  const gid = g
    .selectAll('.gID')
    .data(sdata[0].children)
    .join('g')
    .attr('class', function (d, i) {
      return d.name
    })
    .attr('transform', function (d, i) {
      if (posID[i].id == d.name) {
        return `translate(${posID[i].x}, ${posID[i].y}), rotate(${posID[i].rot},0,0)`
      }
    })

  const innerCirc = gid
    .append('circle')
    .attr('class', 'innerCirc')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', function (d) {
      lengths.push({ name: d.name, num: d.children.length })
      if (d.name == 'years in field') {
        return yearsRadius
      } else {
        return radiusScale(d.children.length)
      }
    })
    .attr('fill', 'none')
    .attr('stroke', 'lightgrey')

  const gthe = g
    .selectAll('.gTHE')
    .data(sdata[1].children)
    .join('g')
    .attr('class', function (d) {
      return d.name
    })
    .attr('transform', function (d, i) {
      return `translate(${posTh[i].x}, ${posTh[i].y}), rotate(${posTh[i].rot},0,0)`
    })
  const innerCircTheme = gthe
    .append('circle')
    .attr('class', 'innerCircTheme')
    .attr('cx', originX)
    .attr('cy', originY)
    .attr('r', function (d) {
      lengths.push({ name: d.name, num: d.children.length })
      return radiusScale(d.children.length)
    })
    .attr('fill', 'none')
    .attr('stroke', 'lightgrey')

  const rectMaxID = gid
    .selectAll('.rectMaxID')
    .data((d) => d.children)
    .join('rect')
    .attr('class', 'rectMaxID')
    .attr('width', function (d, i) {
      if (d.q == 'years' && yearsRadius > 0) {
        return widthScale(yearsMax)
      } else {
        return barwide
      }
    })
    .attr('x', function (d) {
      let radiusHere
      for (let i = 0; i < lengths.length; i++) {
        if (d.parent == lengths[i].name) {
          radiusHere = radiusScale(lengths[i].num)
        }
      }
      if (d.q == 'years' && yearsRadius > 0) {
        return originX + yearsRadius * Math.sin(0)
      } else {
        return originX + radiusHere * Math.sin(0)
      }
    })
    .attr('y', function (d) {
      let radiusHere
      for (let i = 0; i < lengths.length; i++) {
        if (d.parent == lengths[i].name) {
          radiusHere = radiusScale(lengths[i].num)
        }
      }
      if (d.q == 'years' && yearsRadius > 0) {
        return originY + yearsRadius * Math.cos(0)
      } else {
        return originY + radiusHere * Math.cos(0)
      }
    })
    .attr('transform', function (d, i) {
      if (d.q == 'years' && yearsRadius > 0) {
        return 'rotate(' + yearScale(i) + ', 0, 0)'
      }
      if (d.parent == 'education') {
        return 'rotate(' + (180 + barwide * barSpaceEd * i) + ', 0, 0)'
      }
      if (d.parent == 'career path') {
        return 'rotate(' + (180 + barwide * barSpaceCa * i) + ', 0, 0)'
      }
      if (
        d.parent == 'self-ethicist' ||
        d.parent == 'others-ethicist' ||
        d.parent == 'paid work'
      ) {
        return 'rotate(' + (180 + barwide * barSpaceSm * i) + ', 0, 0)'
      } else {
        return 'rotate(' + (180 + barwide * barSpace * i) + ', 0, 0)'
      }
    })
    .attr('fill', 'none')
    .style('stroke-dasharray', '1, 4')
    .attr('stroke', function (d) {
      return colID(d.parent)
    })
    .attr('stroke-width', strokeMin)
    .attr('height', maxBar)

  let rectIdentity = gid
    .selectAll('.rectID')
    .data((d) => d.children)
    .join('rect')
    .attr('class', function (d, i) {
      idVals.push(d.total)
      return 'rectID'
    })
    .attr('width', function (d, i) {
      if (d.q == 'years' && yearsRadius > 0) {
        return widthScale(yearsMax)
      } else {
        return barwide
      }
    })
    .attr('fill', function (d) {
      if (d.value == 1) {
        return colID(d.parent)
      } else {
        return 'black'
      }
    })
    .attr('stroke', function (d) {
      return colID(d.parent)
    })
    .attr('stroke-width', function (d) {
      if (d.value == 1) {
        return strokeHighlight
      } else {
        return strokeNormal
      }
    })
    .attr('x', function (d) {
      let radiusHere
      for (let i = 0; i < lengths.length; i++) {
        if (d.parent == lengths[i].name) {
          radiusHere = radiusScale(lengths[i].num)
        }
      }
      if (d.q == 'years' && yearsRadius > 0) {
        return originX + yearsRadius * Math.sin(0)
      } else {
        return originX + radiusHere * Math.sin(0)
      }
    })
    .attr('y', function (d) {
      let radiusHere
      for (let i = 0; i < lengths.length; i++) {
        if (d.parent == lengths[i].name) {
          radiusHere = radiusScale(lengths[i].num)
        }
      }
      if (d.q == 'years' && yearsRadius > 0) {
        return originY + yearsRadius * Math.cos(0)
      } else {
        return originY + radiusHere * Math.cos(0)
      }
    })
    .attr('transform', function (d, i) {
      if (d.q == 'years' && yearsRadius > 0) {
        return 'rotate(' + yearScale(i) + ', 0, 0)'
      }
      if (d.parent == 'education') {
        return 'rotate(' + (180 + barwide * barSpaceEd * i) + ', 0, 0)'
      }
      if (d.parent == 'career path') {
        return 'rotate(' + (180 + barwide * barSpaceCa * i) + ', 0, 0)'
      }
      if (
        d.parent == 'self-ethicist' ||
        d.parent == 'others-ethicist' ||
        d.parent == 'paid work'
      ) {
        return 'rotate(' + (180 + barwide * barSpaceSm * i) + ', 0, 0)'
      } else {
        return 'rotate(' + (180 + barwide * barSpace * i) + ', 0, 0)'
      }
    })
    .attr('height', 0)
    .on('mouseenter', mouseEnterID)
    .on('mouseleave', mouseLeave)
  maxId = d3.max(idVals)

  const rectMaxTH = gthe
    .selectAll('.rectMaxTH')
    .data((d) => d.children)
    .join('rect')
    .attr('class', 'rectMaxTH')
    .attr('width', function (d, i) {
      if (d.q == 'years' && yearsRadius > 0) {
        return widthScale(yearsMax)
      } else {
        return barwide
      }
    })
    .attr('fill', 'none')
    .attr('x', function (d) {
      let radiusHere
      for (let i = 0; i < lengths.length; i++) {
        if (d.parent == lengths[i].name) {
          radiusHere = radiusScale(lengths[i].num)
        }
      }
      return originX + radiusHere * Math.sin(0)
    })
    .attr('y', function (d) {
      let radiusHere
      for (let i = 0; i < lengths.length; i++) {
        if (d.parent == lengths[i].name) {
          radiusHere = radiusScale(lengths[i].num)
        }
      }
      return originX + radiusHere * Math.cos(0)
    })
    .attr('transform', function (d, i) {
      if (d.parent == 'collab field') {
        return 'rotate(' + (180 + barwide * barSpaceCo * i) + ', 0, 0)'
      }
      if (
        d.parent == 'domain' ||
        d.parent == 'outputs' ||
        d.parent == 'audiences'
      ) {
        return 'rotate(' + (180 + barwide * barSpaceCd * i) + ', 0, 0)'
      }
      if (d.parent == 'topics' || d.parent == 'collab type') {
        return 'rotate(' + (180 + barwide * barSpaceTo * i) + ', 0, 0)'
      } else {
        return 'rotate(' + (180 + barwide * barSpace * i) + ', 0, 0)'
      }
    })
    .attr('fill', 'none')
    .style('stroke-dasharray', '1, 4')
    .attr('stroke', function (d) {
      return colTHEME(d.value)
    })
    .attr('stroke-width', strokeMin)
    .attr('height', maxBar)

  let rectTheme = gthe
    .selectAll('.rectTHE')
    .data((d) => d.children)
    .join('rect')
    .attr('class', function (d) {
      theVals.push(d.total)
      return 'rectTHE'
    })
    .attr('width', barwide)
    .attr('stroke', function (d) {
      return colTHEME(d.value)
    })
    .attr('fill', function (d) {
      if (d.value > 0) {
        return colTHEME(d.value)
      } else {
        return 'black'
      }
    })
    .attr('x', function (d) {
      let radiusHere
      for (let i = 0; i < lengths.length; i++) {
        if (d.parent == lengths[i].name) {
          radiusHere = radiusScale(lengths[i].num)
        }
      }
      return originX + radiusHere * Math.sin(0)
    })
    .attr('y', function (d) {
      let radiusHere
      for (let i = 0; i < lengths.length; i++) {
        if (d.parent == lengths[i].name) {
          radiusHere = radiusScale(lengths[i].num)
        }
      }
      return originX + radiusHere * Math.cos(0)
    })
    .attr('transform', function (d, i) {
      if (d.parent == 'collab field') {
        return 'rotate(' + (180 + barwide * barSpaceCo * i) + ', 0, 0)'
      }
      if (
        d.parent == 'domain' ||
        d.parent == 'outputs' ||
        d.parent == 'audiences'
      ) {
        return 'rotate(' + (180 + barwide * barSpaceCd * i) + ', 0, 0)'
      }
      if (d.parent == 'topics' || d.parent == 'collab type') {
        return 'rotate(' + (180 + barwide * barSpaceTo * i) + ', 0, 0)'
      } else {
        return 'rotate(' + (180 + barwide * barSpace * i) + ', 0, 0)'
      }
    })
    .attr('height', 0)
    .attr('stroke-width', function (d) {
      if (d.value > 0) {
        return strokeHighlight
      } else {
        return strokeNormal
      }
    })
    .on('mouseenter', mouseEnterTH)
    .on('mouseleave', mouseLeave)

  maxTheme = d3.max(theVals)
  maxTotal = sdata[2].responses

  if (maxTotal > 0) {
    if (maxTheme > maxId) {
      barScale.domain([0, maxTheme])
    }
    if (maxId > maxTheme) {
      barScale.domain([0, maxId])
    }
    // barScale.domain([0, maxTotal])
    rectIdentity
      .transition()
      .duration(4000)
      .attr('height', function (d, i) {
        return barScale(d.total)
      })
    rectTheme
      .transition()
      .duration(4000)
      .attr('height', function (d, i) {
        return barScale(d.total)
      })
  }

  const qArray = [
    'self-ethicist',
    'others-ethicist',
    'paid work',
    'years in field',
    'education',
    'career path',
    'domain',
    'topics',
    'outputs',
    'audiences',
    'collab type',
    'collab field',
  ]
  const origQArray = [
    'do you see yourself as an ethicist?',
    'do your colleagues see you as an ethicist?',
    'are you paid for your work on AI/data ethics?',
    'how many years have you been in the field of AI ethics?',
    'which fields are closest to your education or training?',
    'what best describes where you are in your career?',
    'is there a particular domain you look at?',
    'how would you define the broad topic?',
    'what outputs is this work producing?',
    'who is the audience of your work?',
    'do you collaborate with others in this work?',
    'who else is involved in your work on this theme?',
  ]


  function mouseEnterID(event, d) {
    d3.select(this).attr('stroke-width', strokeHighlight * 4)
    tooltip.transition()
     .duration(200)
     .style('opacity', .9)
     .style('left', (event.pageX) + 'px')
     .style('top', (event.pageY - 28) + 'px');

    let addText = []
    if (d.total == 1) {
      addText.push('<br/>'+d.total + ' respondent chose this answer')
    }
    if (d.total > 1) {
      addText.push('<br/>'+d.total + ' total respondents chose this answer')
    }
    if (d.total < 1) {
      addText.push('No one has chosen this answer so far')
    }

    let qName
    for (let i = 0; i < qArray.length; i++) {
      if (d.parent == qArray[i]) {
        qName = origQArray[i]
      }
    }
    addText.push('<br/>Question: ' + qName)
    if (d.value > 0) {
      addText.push('<br/>This was your answer: ' + d.name)
    }
    if (d.value == 0) {
      addText.push('<br/>This answer: ' + d.name)
    }
    tooltip.html(addText.join(''))
  }

  function mouseEnterTH(event, d) {
    d3.select(this).attr('stroke-width', strokeHighlight * 4)

    tooltip.transition()
     .duration(200)
     .style('opacity', .9)
     .style('left', (event.pageX) + 'px')
     .style('top', (event.pageY - 28) + 'px');

    let addText = []
    if (d.total == 1) {
      addText.push('<br/>'+d.total + ' respondent chose this answer')
    }
    if (d.total > 1) {
      addText.push('<br/>'+d.total + ' total respondents chose this answer')
    }
    if (d.total < 1) {
      addText.push('<br/>'+'No one has chosen this answer so far')
    }

    let qName
    for (let i = 0; i < qArray.length; i++) {
      if (d.parent == qArray[i]) {
        qName = origQArray[i]
      }
    }
    addText.push('<br/>Question: ' + qName)
    if (d.value > 0) {
      addText.push('<br/>Your answer was: ' + d.name)
    }
    if (d.value == 0) {
      addText.push('<br/>This answer: ' + d.name)
    }
    if (d.value > 0 && d.value < 12) {
       addText.push('<br/>This was your answer for work theme ' + d.value)
    }
    if (d.value == 12) {
      addText.push('<br/>This was your answer for work themes 1 and 2')
    }
    if (d.value == 13) {
      addText.push('<br/>This was your answer for work themes 1 and 3')
    }
    if (d.value == 23) {
      addText.push('<br/>This was your answer for work themes 2 and 3')
    }
    if (d.value == 123) {
      addText.push('<br/>This was your answer for work themes 1, 2 and 3')
    } else {
    }
    tooltip.html(addText.join(''))
  }



  function mouseLeave(d) {
    d3.select(this).attr('stroke-width', function (d) {
      if (d.value > 0) {
        return strokeHighlight
      } else {
        return strokeNormal
      }
    })
    tooltip.transition()
      .duration(500)
      .style('opacity', 0);
  }

  const zoom = d3
    .zoom()
    .extent([
      [0, 0],
      [width, height],
    ])
    .scaleExtent([1, 8])
    .on('zoom', zoomed)

  svg.call(zoom.scaleBy, 2.1)

  // svg.on('click', reset);

  function zoomed({ transform }) {
    g.attr('transform', transform)
  }

  function reset() {
    svg
      .transition()
      .duration(750)
      .call(
        zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
      )
  }

  const valueline = d3
    .line()
    .x(function (d) {
      return d.x
    })
    .y(function (d) {
      return d.y
    })
    .curve(d3.curveCatmullRom.alpha(0))

  g.append('path').data([idLine]).attr('class', 'lineID').attr('d', valueline)
  g.append('path').data([yearLine]).attr('class', 'yearID').attr('d', valueline)
  g.append('path')
    .data([themeLine])
    .attr('class', 'lineTH')
    .attr('d', valueline)
  g.append('path').data([cnctLine]).attr('class', 'lineCN').attr('d', valueline)
  d3.selectAll('.lineID, .yearID, .lineTH, .lineCN')
    .attr('fill', 'none')
    .attr('stroke', 'lightgrey')
    .style('stroke-dasharray', '1,4')
    .style('stroke-width', 0.5)
  d3.selectAll('.innerCirc, .innerCircTheme').attr('stroke-width', 0.3)

  const idText = gid
    .append('text')
    .attr('class', 'idText')
    .attr('font-size', ft)
    .attr('x', 0)
    .attr('y', 2)
    .attr('text-anchor', 'middle')
    .attr('transform', function (d, i) {
      return `rotate(${-posID[i].rot},0,0)`
    })
    .attr('fill', 'none')
    .text(function (d, i) {
      return 1 + i
    })
  const themeText = gthe
    .append('text')
    .attr('class', 'themeText')
    .attr('font-size', ft)
    .attr('x', 0)
    .attr('y', 2)
    .attr('text-anchor', 'middle')
    .attr('transform', function (d, i) {
      return `rotate(${-posTh[i].rot},0,0)`
    })
    .attr('fill', 'none')
    .text(function (d, i) {
      return 7 + i
    })
  const key = svg
    .append('image')
    .attr('class', 'key')
    .attr('x', width / 15)
    .attr('y', height - 270)
    .attr('width', width - width / 15)
    .attr('height', 0)
    .attr('xlink:href', 'img/wheel-key-spread.svg')

  d3.select('#self-highlight-off').on('click', function () {
    d3.selectAll('.rectID, .rectTHE')
      .transition()
      .attr('fill', 'black')
      .transition()
      .attr('stroke-width', strokeHighlight)
  })
  d3.select('#self-highlight-on').on('click', function () {
    d3.selectAll('.rectID')
      .transition()
      .attr('fill', function (d) {
        if (d.value == 1) {
          return colID(d.parent)
        } else {
          return 'black'
        }
      })
      .transition()
      .attr('stroke-width', function (d) {
        if (d.value == 1) {
          return strokeHighlight
        } else {
          return strokeNormal
        }
      })

    d3.selectAll('.rectTHE')
      .transition()
      .attr('fill', function (d) {
        if (d.value > 0) {
          return colTHEME(d.value)
        } else {
          return 'black'
        }
      })
      .transition()
      .attr('stroke-width', function (d) {
        if (d.value > 0) {
          return strokeHighlight
        } else {
          return strokeNormal
        }
      })
  })

  d3.select('#wheels-labels-on').on('click', function () {
    d3.selectAll('.lineID, .yearID, .lineTH, .lineCN').attr('opacity', 0.1)
    d3.selectAll('.innerCirc, .innerCircTheme').attr('opacity', 0.1)
    d3.selectAll('.rectID, .rectTHE').attr('opacity', '.3')
    d3.selectAll('.idText, .themeText').attr('fill', 'white')
    d3.select('.key').transition().attr('height', 300)
  })
  d3.select('#wheels-labels-off').on('click', function () {
    d3.selectAll('.rectID, .rectTHE').attr('opacity', '1')
    d3.selectAll('.lineID, .yearID, .lineTH, .lineCN').attr('opacity', '.3')
    d3.selectAll('.innerCirc, .innerCircTheme').attr('opacity', 0.5)
    d3.selectAll('.idText, .themeText').attr('fill', 'none')
    d3.select('.key').transition().attr('height', 0)
  })
}
