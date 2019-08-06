import numeral from 'numeral';
import './g2';
import ChartCard from './ChartCard';
import Bar from './Bar';
import BarDiy from './BarDiy';
import BarDiy2 from './BarDiy2';
import BrokenLineDiy from './BrokenLineDiy';
import DotDiy from './DotDiy';
import Pie from './Pie';
import PieDiy from './PieDiy';
import PieDiy2 from './PieDiy2';
import PieDiy3 from './PieDiy3';
import Radar from './Radar';
import RadarDiy from './RadarDiy';
import Gauge from './Gauge';
import GaugeDiy from './GaugeDiy';
import MiniArea from './MiniArea';
import MiniBar from './MiniBar';
import MiniProgress from './MiniProgress';
import Field from './Field';
import WaterWave from './WaterWave';
import TagCloud from './TagCloud';
import TimelineChart from './TimelineChart';

const yuan = val => `¥ ${numeral(val).format('0,0')}`;

const Charts = {
  yuan,
  Bar,
  BarDiy,
  BarDiy2,
  BrokenLineDiy,
  DotDiy,
  GaugeDiy,
  Pie,
  PieDiy,
  PieDiy2,
  PieDiy3,
  Gauge,
  Radar,
  RadarDiy,
  MiniBar,
  MiniArea,
  MiniProgress,
  ChartCard,
  Field,
  WaterWave,
  TagCloud,
  TimelineChart,
};

export {
  Charts as default,
  yuan,
  Bar,
  BarDiy,
  BarDiy2,
  BrokenLineDiy,
  DotDiy,
  GaugeDiy,
  Pie,
  PieDiy,
  PieDiy2,
  PieDiy3,
  Gauge,
  Radar,
  RadarDiy,
  MiniBar,
  MiniArea,
  MiniProgress,
  ChartCard,
  Field,
  WaterWave,
  TagCloud,
  TimelineChart,
};
