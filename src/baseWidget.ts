import {
  DOMWidgetModel,
  DOMWidgetView,
  WidgetView
} from '@jupyter-widgets/base';
import { IThemeManager } from '@jupyterlab/apputils';
import { Debouncer } from '@lumino/polling';
import * as echarts from 'echarts';
import 'echarts-gl';
import { isLightTheme } from './tools';
import { MODULE_NAME, MODULE_VERSION } from './version';

export class BaseEChartsWidgetModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      option: {},
      style: {}
    };
  }

  static serializers = {
    ...DOMWidgetModel.serializers
  };

  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_module_version = MODULE_VERSION;
}

export class BaseEChartsWidgetView extends DOMWidgetView {
  initialize(
    parameters: WidgetView.IInitializeParameters<DOMWidgetModel>
  ): void {
    super.initialize(parameters);

    if (BaseEChartsWidgetView.themeManager) {
      const themeManager = BaseEChartsWidgetView.themeManager;
      themeManager.themeChanged.connect(() => {
        this.updateChart();
      });
    }

    const resizeChart = () => this._myChart?.resize();
    const debouncer = new Debouncer(resizeChart, 100);
    window.addEventListener('resize', () => {
      debouncer.invoke();
    });
  }

  render() {
    super.render();
    this.updateChart();
    this.setStyle();
  }

  updateChart() {
    const currentTheme = isLightTheme() ? 'light' : 'dark';

    if (this._myChart) {
      this._myChart.dispose();
    }

    this._myChart = echarts.init(this.el, currentTheme);
    const chartOption = this.getOption();
    this._myChart.setOption(chartOption);
  }

  getOption(): any {
    return this.model.get('option');
  }

  setStyle(): void {
    const style: { [key: string]: string } = this.model.get('style');
    if (!style) {
      return;
    }

    for (const [key, value] of Object.entries(style)) {
      const fixedKey = key
        .split(/(?=[A-Z])/)
        .map(s => s.toLowerCase())
        .join('-');
      this.el.style.setProperty(fixedKey, value);
    }

    if (this._myChart) {
      this._myChart.resize();
    }
  }

  static themeManager: IThemeManager | null = null;
  protected _myChart?: echarts.ECharts;
}
