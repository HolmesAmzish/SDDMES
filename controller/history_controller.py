from PyQt6.QtWidgets import QDialog, QTableWidgetItem
from PyQt6.QtCore import pyqtSignal
from utilis.database import DatabaseHelper
from view.history_ui import Ui_HistoryDialog


class HistoryDialog(QDialog, Ui_HistoryDialog):
    # Signal to send results back to main window
    results_selected = pyqtSignal(list)

    def __init__(self, db_conn):
        super().__init__()
        self.setupUi(self)
        self.current_results = []  # Initialize current_results list

        self.query_btn.clicked.connect(self.query_by_key_and_order)
        self.restore_chosen_btn.clicked.connect(self.restore_all_results)
        self.conn = db_conn
        
        # Connect table selection to show info
        self.query_result_table.itemClicked.connect(self.show_selected_info)
        # Add double click handler for row selection (for future use)
        self.query_result_table.doubleClicked.connect(self.handle_row_selection)

    def show_selected_info(self, item):
        """Show information of the selected result in the dialog labels"""
        row = item.row()
        if 0 <= row < len(self.current_results):
            result = self.current_results[row]
            # Update the labels with result information
            self.class_label.setText(str(result.label))
            self.dice_label.setText(str(result.dice))

    def restore_all_results(self):
        """Send all current query results back to main window"""
        if self.current_results:
            self.results_selected.emit(self.current_results)
            self.accept()  # Close the dialog
        
    def handle_row_selection(self):
        # Get the selected row (for future use)
        current_row = self.query_result_table.currentRow()
        if current_row >= 0:
            # Emit the results signal with the selected results
            self.results_selected.emit([self.current_results[current_row]])
            self.accept()  # Close the dialog

    def check_key_and_order(self):
        key_list = ['fig_id', 'name', 'date']
        key = key_list[self.key_combo.currentIndex()]
        if self.asc_order.isChecked():
            order = 'ASC'
        elif self.desc_order.isChecked():
            order = 'DESC'
        return key, order

    def query_by_key_and_order(self):
        key, order = self.check_key_and_order()
        self.current_results = self.conn.fetch_results_by_order(key=key, order=order)
        
        # Clear existing rows first
        self.query_result_table.setRowCount(0)
        # Clear the labels
        self.class_label.clear()
        self.dice_label.clear()
        
        for result in self.current_results:
            row_position = self.query_result_table.rowCount()
            self.query_result_table.insertRow(row_position)
            self.query_result_table.setItem(row_position, 0, QTableWidgetItem(str(result.fig_id)))
            self.query_result_table.setItem(row_position, 1, QTableWidgetItem(str(result.name)))
            self.query_result_table.setItem(row_position, 2, QTableWidgetItem(str(result.label)))
            # Format the datetime
            date_str = result.date.strftime("%Y-%m-%d %H:%M:%S") if hasattr(result.date, 'strftime') else str(result.date)
            self.query_result_table.setItem(row_position, 3, QTableWidgetItem(date_str))
            
        # Enable restore button if we have results
        self.restore_chosen_btn.setEnabled(len(self.current_results) > 0)

        

    