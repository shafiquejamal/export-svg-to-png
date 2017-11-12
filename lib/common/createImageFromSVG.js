import * as d3 from 'd3';

const createImageFromSVG = (selectorForSVG) => {
  // get styles from all required stylesheets
  // http://www.coffeegnome.net/converting-svg-to-png-with-canvg/
  let style = '\n';
  for (let i = 0; i < document.styleSheets.length; i++) {
    const sheet = document.styleSheets[i];

    if (sheet.href) {
      const { rules } = sheet;
      if (rules) {
        for (let j = 0; j < rules.length; j++) {
          style += (`${rules[j].cssText}\n`);
        }
      }
    }
  }

  const svg = d3.select(selectorForSVG);
  const img = new Image();
  const serializer = new XMLSerializer();

  // prepend style to svg
  svg.insert('defs', ':first-child');
  d3.select('svg defs')
    .append('style')
    .attr('type', 'text/css')
    .html(style);

  // generate IMG in new tab
  const svgStr = serializer.serializeToString(svg.node());
  img.src = `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svgStr)))}`;

  const popUp = window.open();
  if (popUp) {
    popUp.document.write(`<img src="${img.src}"/>`);
  }
};

export default createImageFromSVG;
