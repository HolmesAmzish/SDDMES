from PyQt6.QtWidgets import QDialog
from PyQt6.QtCore import pyqtSignal
from utilis.database import DatabaseHelper
from view.history_ui import Ui_HistoryDialog

class HistoryDialog(QDialog, Ui_HistoryDialog):
    def __init__(self, db_conn):
        super().__init__()
        self.setupUi(self)

    