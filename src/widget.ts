// Copyright (c) Trung Le
// Distributed under the terms of the Modified BSD License.

import { BaseEChartsModel } from './baseEchartsModel';
import { BaseEChartsView } from './baseEchartsView';
import { ISerializers, unpack_models } from '@jupyter-widgets/base';
import { IUpdateManager } from './types';
import { ObjectHash } from 'backbone';
import { IBackboneModelOptions } from '@jupyter-widgets/base';
import { MODULE_NAME, MODULE_VERSION } from './version';

export class EChartsWidgetModel extends BaseEChartsModel {
  static serializers: ISerializers = {
    ...BaseEChartsModel.serializers,
    option: { deserialize: unpack_models as any }
  };

  initialize(attributes: ObjectHash, options: IBackboneModelOptions): void {
    super.initialize(attributes, options);
    if (EChartsWidgetModel.updateManager) {
      EChartsWidgetModel.updateManager.registerModel(this);
    }
    this.listenTo(this, 'change', this.valueChanged);
  }

  valueChanged(m: EChartsWidgetModel): void {
    if (m?.changed) {
      Object.values(m.changed).forEach(it => {
        if (Array.isArray(it)) {
          it.forEach(subModel => {
            if (subModel?.model_id) {
              EChartsWidgetModel.updateManager?.registerChildModel({
                child: subModel,
                parent: m
              });
            }
          });
        } else {
          if (it?.model_id) {
            EChartsWidgetModel.updateManager?.registerChildModel({
              child: it,
              parent: m
            });
          }
        }
      });
    }
  }

  static updateManager: IUpdateManager | null = null;

  static model_name = 'EChartsWidgetModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'EChartsWidgetView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class EChartsWidgetView extends BaseEChartsView {
  getChartOption(): any {
    return this.createOptionDict();
  }

  private createOptionDict(): { [key: string]: any } {
    const option = this.model.get('option');
    const optionDict: { [key: string]: any } = option.toDict();

    const chartOption: { [key: string]: any } = {};
    for (const [key, val] of Object.entries(optionDict)) {
      if (!val) {
        continue;
      }
      if (val.toDict) {
        chartOption[key] = val.toDict();
      } else if (Array.isArray(val)) {
        const valArray = val.map(it => (it.toDict ? it.toDict() : it));
        chartOption[key] = valArray;
      } else {
        chartOption[key] = val;
      }
    }

    return chartOption;
  }

  static themeManager = BaseEChartsView.themeManager;
}
