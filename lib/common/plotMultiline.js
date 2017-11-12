import * as c3 from 'c3';
import * as d3 from 'd3';
import { saveSvgAsPng } from 'save-svg-as-png';
import createImageFromSVG from './createImageFromSVG';

const plotMultiline = (
  chartID, dataToPlot,
  headingsAndLabels,
  xHeading,
  nTicks,
  xRange,
  xLines = [],
  title,
  xAxisTitle,
  note,
  yTitle = 'Frequency of occurrence',
  inset = null,
) => {
  d3.select('body').append('div')
    .attr('id', chartID);

  const yDatas = Object.entries(headingsAndLabels).map(([columnName, newLabel]) =>
    [newLabel, ...dataToPlot.map(d => d[columnName])]);
  const firstKey = Object.keys(dataToPlot[0])[0];
  const secondKey = Object.keys(dataToPlot[0])[1];
  const xMin = +dataToPlot[0][firstKey];
  const xMax = +[...dataToPlot].pop()[secondKey];
  const xTickValuesAll = [...dataToPlot.map(d => +d[firstKey])];
  const nXTickValuesAll = xTickValuesAll.length;
  const xTickValuesIndices =
    [...Array(nTicks).keys()].map(d => d * Math.ceil(nXTickValuesAll / nTicks))
      .filter(d => d <= nXTickValuesAll - 1);

  let xTickValues = [];
  if (nTicks) {
    if (typeof nTicks === 'number') {
      xTickValues = [...xTickValuesIndices.map(i => +xTickValuesAll[i]), xMax];
    } else if (nTicks === 'integer') {
      xTickValues = [...xTickValuesAll, xMax].filter(d => Math.round(d) === d);
    }
  } else {
    xTickValues = [...xTickValuesAll, xMax];
  }
  const rightPadding = (xTickValues[1] - xTickValues[0]) / 5;

  const chart = c3.generate({
    bindto: `#${chartID}`,
    title: {
      text: title,
    },
    point: {
      show: false,
    },
    size: {
      width: 960,
      height: 500,
    },
    padding: {
      bottom: 20,
      top: 20,
    },
    data: {
      x: xHeading,
      columns: yDatas,
    },
    legend: {
      position: 'inset',
      inset,
    },
    axis: {
      x: {
        tick: {
          outer: false,
          values: xTickValues,
        },
        min: xMin,
        max: xMax,
        padding: { left: 0, right: rightPadding },
        label: {
          text: xAxisTitle || xHeading,
          position: 'outer-center',
        },
        height: 50,
      },
      y: {
        padding: { top: 0, bottom: 0 },
        label: {
          text: yTitle,
          position: 'outer-middle',
        },
      },
    },
    grid: {
      x: {
        show: true,
        lines: xLines,
      },
      y: {
        show: true,
      },
    },
  });

  d3.select(`#${chartID} svg`).attr('id', `svg-${chartID}`);

  if (note) {
    d3.select(`#${chartID} svg`).append('text')
      .attr('x', 630)
      .attr('y', 485)
      .classed('note', true)
      .text(note);
  }

  if (xRange) {
    const xRangeMin = xRange[0];
    const xRangeMax = xRange[1];

    chart.axis.range({
      min: {
        x: xRangeMin,
      },
      max: {
        x: xRangeMax,
      },
    });
  }

  setTimeout(() => {
    d3.select(`#${chartID}`)
      .append('button')
      .on('click', () => saveSvgAsPng(d3.select(`#svg-${chartID}`)[0]['0'], `#svg-${chartID}.png`))
      .classed('btn btn-success', true)
      .attr('id', 'button-library');

    d3.select(`#${chartID}`)
      .append('button')
      .on('click', () => createImageFromSVG(`#svg-${chartID}`))
      .classed('btn btn-success', true)
      .attr('id', 'button-so-script');
  }, 1000);
};

export default plotMultiline;
