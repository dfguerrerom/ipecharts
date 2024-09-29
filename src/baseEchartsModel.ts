import { DOMWidgetModel, ISerializers } from '@jupyter-widgets/base';
import { MODULE_NAME, MODULE_VERSION } from './version';

export abstract class BaseEChartsModel extends DOMWidgetModel {
  defaults() {
    const constructor = this.constructor as typeof BaseEChartsModel;
    return {
      ...super.defaults(),
      _model_name: constructor.model_name,
      _model_module: constructor.model_module,
      _model_module_version: constructor.model_module_version,
      _view_name: constructor.view_name,
      _view_module: constructor.view_module,
      _view_module_version: constructor.view_module_version,
      option: {},
      style: {},
      theme: null,
      renderer: 'canvas',
      device_pixel_ratio: window.devicePixelRatio,
      locale: 'EN',
      use_dirty_rect: false,
      height: '',
      width: ''
    };
  }
  // is this actually needed?
  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers
    // Optionally include 'option' serializer in subclasses if needed
  };

  static model_name = 'BaseEChartsModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'BaseEChartsView';
  static view_module = MODULE_NAME;
  static view_module_version = MODULE_VERSION;
}
