import os
from queue import Queue
import cv2
import torch
from PyQt6 import QtWidgets, QtGui, QtCore
from PyQt6.QtGui import QImage, QPixmap
from PyQt6.QtWidgets import QFileDialog, QTableWidgetItem
from PyQt6.QtCore import QTimer
from view.main_ui import Ui_MainWindow
from utilis.database import DatabaseHelper, DetectObj
from utilis.label_transfer import format_defects
from controller.figure_process_worker import FigureProcessWorker
from controller.video_process_worker import VideoProcessWorker
from controller.history_controller import HistoryDialog


class MainWindow(QtWidgets.QMainWindow, Ui_MainWindow):

    # Initialize models
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    class_model_path = "models/class/model_class_final 0.85.pth"
    seg_model_path = "models/seg/model_FPN_final 0.899.pth"
    class_model = torch.load(class_model_path, map_location=device, weights_only=False)
    seg_model = torch.load(seg_model_path, map_location=device, weights_only=False)

    def __init__(self):
        super().__init__()
        self.setupUi(self)

        # Initialize database
        self.conn = DatabaseHelper(host='localhost', user='cacc', password='20230612')
        
        # Maintain a queue to be detected and a list for saving results
        self.chosen_video = None  # Chosen video to be detected
        self.detect_queue = Queue()  # Figure queue to be detected
        self.result_list = []  # List to store detection result of figures
        self.timer = QTimer(self)
        self.file_path = ''

        # Figures detection operation group btn
        self.figure_btn.clicked.connect(self.browse_image)
        self.folder_btn.clicked.connect(self.browse_folder)

        self.run_btn.clicked.connect(self.start_detection)
        self.save_all_btn.clicked.connect(self.save_all_to_db)
        self.check_db_btn.clicked.connect(self.show_history_dialog)

        self.result_table.horizontalHeader().sectionClicked.connect(self.sort_table_by_column)

        # Video detection operation group btn
        self.video_browse_btn.clicked.connect(self.select_video)
        self.video_detect_btn.clicked.connect(self.start_video_detection)
        self.play_origin_btn.clicked.connect(self.play_origin_video)
        self.play_detected_btn.clicked.connect(self.play_detected_video)


    """
    Single Figure Process Tab
    Steel Defect Detection by images
    Choose single figure or the folder of figure and detect
    """
    def browse_image(self):
        file_path, _ = QFileDialog.getOpenFileName(None, "选择图片文件", "", 'Images (*.png *.jpg *.jpeg *.xpm)')
        if file_path:
            figure_name = os.path.basename(file_path)
            self.figure_label.setText(figure_name)
            self.figure_path_edit.setText(file_path)
        else:
            self.console.append(f"添加未找到文件: {file_path}")

        self.add_figure()

    def add_figure(self):
        figure_path = self.figure_path_edit.text().strip()

        if not figure_path:
            self.console.append("错误：未选择文件！")
            return

        if not os.path.isfile(figure_path):
            self.console.append(f"错误：文件不存在 -> {figure_path}")
            return

        try:
            with open(figure_path, "rb") as f:
                figure = f.read()
            detect_obj = DetectObj(os.path.basename(figure_path), figure, figure_path)
            self.enqueue_figure(detect_obj)
            self.console.append(f"成功添加文件: {figure_path}")
        except Exception as e:
            self.console.append(f"错误：读取文件失败 -> {str(e)}")

    def browse_folder(self):
        """Add all detect objects in specific folder into detect_queue"""
        file_path = QFileDialog.getExistingDirectory(None, "选择图片文件夹")
        if file_path:
            self.folder_label.setText(os.path.basename(file_path))
            self.folder_path_edit.setText(file_path)
        else:
            self.console.append(f"添加未找到文件夹: {file_path}")

        self.add_figure_folder()

    def add_figure_folder(self):
        folder_path = self.folder_path_edit.text().strip()

        if not folder_path:
            self.console.append("错误：未选择文件夹！")
            return

        if not os.path.isdir(folder_path):
            self.console.append(f"错误：文件夹不存在 -> {folder_path}")
            return

        added_files = 0
        for filename in os.listdir(folder_path):
            if filename.lower().endswith((".jpg", ".png", ".jpeg", ".xpm")):
                full_path = os.path.join(folder_path, filename)

                try:
                    with open(full_path, "rb") as f:
                        figure = f.read()
                    detect_obj = DetectObj(filename, figure, full_path)
                    self.enqueue_figure(detect_obj)
                    added_files += 1
                except Exception as e:
                    self.console.append(f"错误：读取文件失败 -> {filename}: {str(e)}")

        if added_files > 0:
            self.console.append(f"成功添加 {added_files} 张图片")
        else:
            self.console.append("错误：未找到符合格式的图片文件")

    def start_detection(self):
        self.detection_worker = FigureProcessWorker(self.detect_queue, self.class_model, self.seg_model)
        self.detection_worker.result_signal.connect(self.handle_result)
        self.detection_worker.start()

    def show_history_dialog(self):
        history_dialog = HistoryDialog(self.conn)
        # Connect the signal to handle selected results
        history_dialog.results_selected.connect(self.handle_history_results)
        history_dialog.exec()

    def handle_history_results(self, results):
        """Handle the results selected from history dialog"""
        for result in results:
            # Add the result to the result list
            self.result_list.append(result)
            # Insert the result into the table
            self.insert_result_to_table(result)
            # Show the result info
            self.show_info(result)

    def handle_result(self, result):
        self.result_list.append(result)
        self.detect_list.takeItem(0)
        self.show_info(result)
        self.insert_result_to_table(result)

    def enqueue_figure(self, detect_obj):
        """Push object to detect into queue"""
        self.detect_queue.put(detect_obj)
        self.detect_list.addItem(detect_obj.name)
 
    def insert_result_to_table(self, result):
        """Insert detect result to table view"""
        row_position = self.result_table.rowCount()
        self.result_table.insertRow(row_position)
        self.result_table.setItem(row_position, 0, QTableWidgetItem(result.name))
        self.result_table.setItem(row_position, 1, QTableWidgetItem(format_defects(result.label)))
        self.result_table.setItem(row_position, 2, QTableWidgetItem(str(result.num)))
        self.result_table.setItem(row_position, 3, QTableWidgetItem(result.time))
        self.result_table.itemClicked.connect(self.show_item_info)

    def sort_table_by_column(self, column):
        self.result_table.sortItems(column, QtCore.Qt.SortOrder.AscendingOrder)
    
    def sort_table_by_column(self, index):
        """点击表头排序"""
        self.result_table.sortItems(index, QtCore.Qt.SortOrder.AscendingOrder)


    def show_item_info(self, item):
        """Show item info of table"""
        row = item.row()
        self.show_info(self.result_list[row])

    def save_all_to_db(self):
        for result in self.result_list:
            self.conn.save_result(result)
        print("所有记录已插入数据库。")

    def show_info(self, result):
        """TODO: Show the information of specific record in result_table"""
        self.class_label.setText(f'类别：{format_defects(result.label)}')
        self.dice_label.setText(f'分类置信度：{result.dice}')

        detail_text = (
            f"图片名称：{result.name}，检测时间：{result.time}，缺陷数量：{result.num}"
        )
        
        self.detail_info_label.setText(detail_text)

        # Show result figure
        pixmap = QtGui.QPixmap()
        pixmap.loadFromData(result.res_fig)
        self.result_label.setPixmap(pixmap)

    """
    Video Process Tab
    Steel Defect Detection by videos and camera
    Choose video and camera captured frame to detect
    """

    def select_video(self):
        self.file_path, _ = QFileDialog.getOpenFileName(None, "选择视频文件", "", 'Video files (*.mp4 *.avi)')
        if self.file_path:
            video_name = os.path.basename(self.file_path)
            self.chosen_video = cv2.VideoCapture(self.file_path)
            if not self.chosen_video.isOpened():
                print("无法打开视频文件！")
                return

    def start_video_detection(self):
        """Start the video detection in a separate thread"""
        if self.chosen_video is not None:
            self.video_processer_output.append("开始视频检测...")
            self.video_thread = VideoProcessWorker(self.chosen_video, self.class_model, self.seg_model)
            self.video_thread.started.connect(lambda: self.video_processer_output.append("视频检测进行中..."))
            self.video_thread.finished.connect(lambda: self.video_processer_output.append("视频检测完成。"))
            self.video_thread.start()

    def play_detected_video(self):
        self.cap = cv2.VideoCapture("output.mp4")
        if not self.cap.isOpened():
            self.video_processer_output.append("无法打开检测后的视频文件！")
            return
        self.video_processer_output.append("播放检测后的视频...")
        self.timer.timeout.connect(self.update_frame)
        self.timer.start(1000 // 12)

    def play_origin_video(self):
        self.cap = cv2.VideoCapture(self.file_path)
        if not self.cap.isOpened():
            self.video_processer_output.append("无法打开原始视频文件！")
            return
        self.video_processer_output.append("播放原始视频...")
        self.timer.timeout.connect(self.update_frame)
        self.timer.start(1000 // 24)

    def update_frame(self):
        # Read a frame from the video
        ret, frame = self.cap.read()

        if ret:
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            height, width, channels = frame_rgb.shape
            bytes_per_line = channels * width
            qimage = QImage(frame_rgb.data, width, height, bytes_per_line, QImage.Format.Format_RGB888)

            pixmap = QPixmap.fromImage(qimage)
            self.video_display_label.setPixmap(pixmap)
        else:
            self.cap.release()
            self.timer.stop()