from ipywidgets import DOMWidget, widget_serialization
from traitlets import Bool, Dict, Float, Instance, Unicode

from .option.option import Option
from ._frontend import module_name, module_version


class BaseEChartsWidget(DOMWidget):
    theme = Unicode(default_value="light", help="Theme").tag(sync=True)
    renderer = Unicode(default_value="canvas", help="Renderer type").tag(sync=True)
    device_pixel_ratio = Float(help="Device pixel ratio").tag(sync=True)
    locale = Unicode(default_value="EN", help="Locale").tag(sync=True)
    use_dirty_rect = Bool(
        default_value=False, help="Use dirty rectangle rendering"
    ).tag(sync=True)
    style = Dict({}, help="Style configuration").tag(sync=True)
    height = Unicode("auto", help="Height of the widget").tag(sync=True)
    width = Unicode("auto", help="Width of the widget").tag(sync=True)


class EChartsWidget(BaseEChartsWidget):
    _model_name = Unicode("EChartsWidgetModel").tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode("EChartsWidgetView").tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    option = Instance(Option, kw={}, args=()).tag(sync=True, **widget_serialization)


class EChartsRawWidget(BaseEChartsWidget):
    _model_name = Unicode("EChartsRawWidgetModel").tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode("EChartsRawWidgetView").tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    option = Dict(default_value={}).tag(sync=True, **widget_serialization)
