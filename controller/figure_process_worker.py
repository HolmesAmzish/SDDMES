from PyQt6.QtCore import QThread, pyqtSignal
from utilis.database import DetectResult, DetectObj
from utilis.pred import predict
from utilis.eda import eda
from datetime import datetime


class FigureProcessWorker(QThread):
    result_signal = pyqtSignal(DetectResult)

    def __init__(self, detect_queue, class_model, seg_model):
        super().__init__()
        self.detect_queue = detect_queue
        self.class_model = class_model
        self.seg_model = seg_model

    def run(self):
        while not self.detect_queue.empty():
            detect_obj = self.detect_queue.get()
            predicted_label, segmentation, time_cost = predict(
                name=detect_obj.name,
                image_data=detect_obj.figure,
                model_class=self.class_model,
                model_seg=self.seg_model,
                mode=2
            )
            res_fig = eda(df=segmentation, data=detect_obj.figure)

            result = DetectResult(
                name=detect_obj.name,
                res_fig=res_fig,
                date=datetime.now(),
                time=f'{time_cost:.2f}',
                label=', '.join(predicted_label['predict_label'].astype(str)),
                num=len(segmentation[segmentation["EncodedPixels"] != '']),
                dice=', '.join(predicted_label['probability_label'].astype(str)),
            )
            self.result_signal.emit(result)
