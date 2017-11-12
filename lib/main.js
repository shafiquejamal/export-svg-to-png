import * as d3 from 'd3';
import plotMultiline from './common/plotMultiline';

const promiseWrapper =
  (xhr, d) => new Promise(resolve => xhr(d, p => resolve(p)));

Promise.all([
  promiseWrapper(d3.csv, '../data/distribution.csv'),
]).then(([ageDistribution]) => {
  plotMultiline('distribution', ageDistribution, {
    _midpoint_: 'age',
    MALE: 'Male',
    FEMALE: 'FEMALE',
  }, 'age', 5, [0, 100], [], 'Age distribution', 'Age (years)');
});
