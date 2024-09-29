// Copyright (c) Trung Le
// Distributed under the terms of the Modified BSD License.
import { BaseEChartsModel } from './baseEchartsModel';
import { BaseEChartsView } from './baseEchartsView';
import { MODULE_NAME, MODULE_VERSION } from './version';

export class EChartsRawWidgetModel extends BaseEChartsModel {
  static model_name = 'EChartsRawWidgetModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'EChartsRawWidgetView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class EChartsRawWidgetView extends BaseEChartsView {
  getChartOption(): any {
    return this.model.get('option');
  }

  static themeManager = BaseEChartsView.themeManager;
}
