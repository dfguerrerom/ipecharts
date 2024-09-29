import { DOMWidgetView, WidgetView } from '@jupyter-widgets/base';
import { IThemeManager } from '@jupyterlab/apputils';
import { Debouncer } from '@lumino/polling';
import * as echarts from 'echarts';
import 'echarts-gl';
import { isLightTheme } from './tools';

export abstract class BaseEChartsView extends DOMWidgetView {
  initialize(parameters: WidgetView.IInitializeParameters): void {
    console.log('BaseEChartsView.initialize!!!!!!!!!!');
    super.initialize(parameters);
    this.setupThemeListener();
    this.setupResizeListener();
    this.model.on('change:style', this.setStyle, this);

    // Define arrays of properties
    const initProps = [
      'theme',
      'renderer',
      'device_pixel_ratio',
      'locale',
      'use_dirty_rect'
    ];
    // Set up listeners for init properties
    initProps.forEach(prop => {
      this.model.on(`change:${prop}`, this.recreateChart, this);
    });
    this.model.on('change', this.value_changed, this);
  }

  protected recreateChart(): void {
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
    let theme = this.model.get('theme');

    if (!theme) {
      if (BaseEChartsView.themeManager) {
        theme = isLightTheme() ? 'light' : 'dark';
      } else {
        console.log('No theme manager found');
        theme = 'light';
      }
    }
    const renderer = this.model.get('renderer') || 'canvas';
    const devicePixelRatio =
      this.model.get('device_pixel_ratio') || window.devicePixelRatio;
    const locale = this.model.get('locale') || 'EN';
    const useDirtyRect = this.model.get('use_dirty_rect') || false;

    const initOptions = {
      renderer,
      devicePixelRatio,
      locale,
      useDirtyRect
    };
    this._myChart = echarts.init(this.el, theme, initOptions);
    this._myChart.setOption(this.getChartOption());
  }
  value_changed() {
    console.log('something changed from idk where');
    if (this._myChart) {
      this._myChart.setOption(this.getChartOption());
    }
  }

  abstract getChartOption(): any;

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
    if (themeManager) {
      themeManager.themeChanged.connect(() => {
        console.log('theme changed');
        this.recreateChart();
      });
    }
  }
  // protected onThemeChanged(): void {
  //   // Only update the theme if 'theme' is not set in the model
  //   if (!this.model.get('theme')) {
  //     this.recreateChart();
  //   }
  // }
  // protected onThemeModelChanged(): void {
  //   const theme = this.model.get('theme');
  //   if (theme) {
  //     this.stopListeningToThemeManager();
  //   } else {
  //     this.startListeningToThemeManager();
  //   }
  //   this.recreateChart();
  // }

  // protected stopListeningToThemeManager(): void {
  //   BaseEChartsView.themeManager?.themeChanged.disconnect(
  //     this.onThemeChanged,
  //     this
  //   );
  // }
  // protected startListeningToThemeManager(): void {
  //   BaseEChartsView.themeManager?.themeChanged.connect(
  //     this.onThemeChanged,
  //     this
  //   );
  // }

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
