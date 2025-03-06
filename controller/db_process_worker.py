from PyQt6.QtCore import QThread, pyqtSignal
import time


class SaveThread(QThread):
    finished = pyqtSignal()

    def __init__(self, result_list, db_helper):
        super().__init__()
        self.result_list = result_list
        self.db_helper = db_helper

    def run(self):
        for result in self.result_list:
            self.db_helper.save_result(result)
        self.finished.emit()

class FetchThread(QThread):
    finished = pyqtSignal(list)

    def __init__(self, db_helper):
        super().__init__()
        self.db_helper = db_helper

    def run(self):
        results = self.db_helper.fetch_results_by_order()
        self.finished.emit(results)
        