// Copyright (c) Trung Le
// Distributed under the terms of the Modified BSD License.

import { BaseEChartsWidgetModel, BaseEChartsWidgetView } from './baseWidget';

export class EChartsWidgetModel extends BaseEChartsWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: EChartsWidgetModel.model_name,
      _view_name: EChartsWidgetModel.view_name
    };
  }

  static model_name = 'EChartsWidgetModel';
  static view_name = 'EChartsWidgetView';
}

export class EChartsWidgetView extends BaseEChartsWidgetView {
  getOption(): any {
    const option = this.model.get('option');
    const optionDict: { [key: string]: any } = option.toDict();

    const chartOption: { [key: string]: any } = {};
    for (const [key, val] of Object.entries(optionDict)) {
      if (val && val.toDict) {
        chartOption[key] = val.toDict();
      } else if (Array.isArray(val)) {
        chartOption[key] = val.map(it => (it.toDict ? it.toDict() : it));
      } else {
        chartOption[key] = val;
      }
    }

    return chartOption;
  }
}
