// Copyright (c) Trung Le

import { BaseEChartsWidgetModel, BaseEChartsWidgetView } from './baseWidget';

// Distributed under the terms of the Modified BSD License.
export class EChartsRawWidgetModel extends BaseEChartsWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: EChartsRawWidgetModel.model_name,
      _view_name: EChartsRawWidgetModel.view_name
    };
  }

  static model_name = 'EChartsRawWidgetModel';
  static view_name = 'EChartsRawWidgetView';
}

export class EChartsRawWidgetView extends BaseEChartsWidgetView {
  // No need to override getOption if it simply returns the model's 'option'.
}
