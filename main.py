import sys
from PyQt6.QtWidgets import QApplication
from controller.main_controller import MainWindow
from controller.login_controller import LoginController


if __name__ == "__main__":
    app = QApplication(sys.argv)
    
    # Show login dialog
    login = LoginController()
    if login.exec() == 1 and login.is_login_successful:
        # Only show main window if login was successful
        window = MainWindow()
        window.show()
        sys.exit(app.exec())
    else:
        sys.exit(0)