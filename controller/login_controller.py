from PyQt6.QtWidgets import QDialog, QMessageBox
from view.login_ui import Ui_Dialog

class LoginController(QDialog):
    def __init__(self):
        super().__init__()
        self.ui = Ui_Dialog()
        self.ui.setupUi(self)
        
        # Connect the login button to the login method
        self.ui.pushButton.clicked.connect(self.login)
        
        # Set password echo mode
        self.ui.lineEdit_2.setEchoMode(self.ui.lineEdit_2.EchoMode.Password)
        
        # Store login status
        self.login_successful = False
        
        # You might want to load saved username if "remember password" was checked
        self.load_saved_credentials()
    
    def login(self):
        username = self.ui.lineEdit.text()
        password = self.ui.lineEdit_2.text()
        
        # TODO: Replace with your actual authentication logic
        if self.authenticate(username, password):
            if self.ui.checkBox.isChecked():
                self.save_credentials(username)
            self.login_successful = True
            self.accept()
        else:
            QMessageBox.warning(
                self,
                "登录失败",
                "用户名或密码错误！",
                QMessageBox.StandardButton.Ok
            )
    
    def authenticate(self, username, password):
        # TODO: Implement your actual authentication logic here
        # This is a simple example - replace with your actual authentication system
        return username == "admin" and password == "password"
    
    def save_credentials(self, username):
        # TODO: Implement credential saving if needed
        pass
    
    def load_saved_credentials(self):
        # TODO: Implement credential loading if needed
        pass
    
    @property
    def is_login_successful(self):
        return self.login_successful 