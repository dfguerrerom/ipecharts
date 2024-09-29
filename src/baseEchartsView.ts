import { DOMWidgetView, WidgetView } from '@jupyter-widgets/base';
import { IThemeManager } from '@jupyterlab/apputils';
import { Debouncer } from '@lumino/polling';
import * as echarts from 'echarts';
import 'echarts-gl';
import { isLightTheme } from './tools';

export abstract class BaseEChartsView extends DOMWidgetView {
  initialize(parameters: WidgetView.IInitializeParameters): void {
    console.log('BaseEChartsView.initialize!!!!!!!!!!!!!!!!!');
    super.initialize(parameters);
    this.setupThemeListener();
    this.setupResizeListener();
    this.model.on('change:style', this.setStyle, this);
    this.model.on('change:option', this.optionChanged, this);
    this.model.on('change:theme', this.recreateChart, this);
    this.model.on('change:renderer', this.recreateChart, this);
    this.model.on('change:device_pixel_ratio', this.recreateChart, this);
    this.model.on('change:locale', this.recreateChart, this);
    this.model.on('change:use_dirty_rect', this.recreateChart, this);
    this.model.on('change:height', this.recreateChart, this);
    this.model.on('change:width', this.recreateChart, this);
  }

  protected recreateChart(): void {
    // Dispose of the current chart and recreate it
    console.log('BaseEChartsView.recreateChart');
    this._myChart?.dispose();
    this.initChart();
  }

  render(): void {
    super.render();
    this.el.classList.add('echarts-widget');
    this.initChart();
    this.setStyle();
  }

  processLuminoMessage(msg: any): void {
    const msgType = msg.type as string;

    if (msgType === 'resize' || msgType === 'after-attach') {
      window.dispatchEvent(new Event('resize'));
    }
  }

  initChart(): void {
    // Retrieve the 'theme' from the model
    let theme = this.model.get('theme');

    if (!theme) {
      // If 'theme' is not set in the model
      if (BaseEChartsView.themeManager) {
        // Use the theme from the themeManager
        theme = isLightTheme() ? 'light' : 'dark';
      } else {
        // Default to 'light' theme if themeManager is null
        theme = 'light';
      }
    } else {
      // If 'theme' is set, we won't listen to themeManager changes
      this.stopListeningToThemeManager();
    }
    const renderer = this.model.get('renderer') || 'canvas';
    const devicePixelRatio =
      this.model.get('device_pixel_ratio') || window.devicePixelRatio;
    const locale = this.model.get('locale') || 'EN';
    const useDirtyRect = this.model.get('use_dirty_rect') || false;
    // const height = this.model.get('height') || 'auto';
    // const width = this.model.get('width') || 'auto';

    const initOptions = {
      renderer,
      devicePixelRatio,
      locale,
      useDirtyRect
      // height,
      // width
    };
    this._myChart = echarts.init(this.el, theme, initOptions);
    this.updateChartOption();
  }

  updateChartOption(): void {
    const option = this.getChartOption();
    if (option && this._myChart) {
      this._myChart.setOption(option);
    }
  }
  // make sure to implement this method in the other subclasses
  abstract getChartOption(): any;

  protected optionChanged(): void {
    console.log('BaseEChartsView.optionChanged 2');
    this.updateChartOption();
  }

  setStyle(): void {
    const style = (this.model.get('style') as { [key: string]: string }) || {};
    for (const [key, value] of Object.entries(style)) {
      const cssKey = key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
      this.el.style.setProperty(cssKey, value);
    }
    this._myChart?.resize();
  }

  protected setupThemeListener(): void {
    const themeManager = BaseEChartsView.themeManager;
    // Listen to 'change:theme' event on the model
    this.model.on('change:theme', this.onThemeModelChanged, this);
    // If 'theme' is not set in the model and themeManager is available
    if (!this.model.get('theme') && themeManager) {
      themeManager.themeChanged.connect(this.onThemeChanged, this);
    }
  }
  protected onThemeChanged(): void {
    // Only update the theme if 'theme' is not set in the model
    if (!this.model.get('theme')) {
      this.recreateChart();
    }
  }
  protected onThemeModelChanged(): void {
    const theme = this.model.get('theme');
    if (theme) {
      // Stop listening to themeManager changes
      this.stopListeningToThemeManager();
    } else {
      // Start listening to themeManager changes
      this.startListeningToThemeManager();
    }
    // Recreate the chart with the new theme
    this.recreateChart();
  }

  protected stopListeningToThemeManager(): void {
    BaseEChartsView.themeManager?.themeChanged.disconnect(
      this.onThemeChanged,
      this
    );
  }
  protected startListeningToThemeManager(): void {
    BaseEChartsView.themeManager?.themeChanged.connect(
      this.onThemeChanged,
      this
    );
  }

  protected setupResizeListener(): void {
    const resizeChart = () => this._myChart?.resize();
    const debouncer = new Debouncer(resizeChart, 100);
    window.addEventListener('resize', () => debouncer.invoke());
  }

  update_classes(old_classes: string[], new_classes: string[]): void {
    super.update_classes(old_classes, new_classes);
    this._myChart?.resize();
  }

  static themeManager: IThemeManager | null = null;
  protected _myChart?: echarts.ECharts;
}
