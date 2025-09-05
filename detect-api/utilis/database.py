import pymysql

"""
File: database.py
Date: 2025-03-01
"""
class DatabaseHelper:
    def __init__(self, password, database="steel_defect", host="localhost", user="cacc", port=3306):
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.port = port
        try:
            self.conn = pymysql.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                port=self.port,
            )
            self.cursor = self.conn.cursor()
            print(f"成功连接到数据库: {self.database}")
        except pymysql.MySQLError as e:
            print(f"数据库连接失败: {e}")
            return

        self.init_database()

    def init_database(self):
        """Initialize database and table if not exists."""
        try:
            # Create the database if it does not exist
            create_db_query = f"CREATE DATABASE IF NOT EXISTS {self.database} DEFAULT CHARSET=utf8mb4"
            self.cursor.execute(create_db_query)
            self.conn.select_db(self.database)  # Switch to the database

            # Create the table if it does not exist
            create_table_query = """
            CREATE TABLE IF NOT EXISTS res (
                fig_id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                res_fig MEDIUMBLOB NOT NULL,
                date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                time VARCHAR(255) NOT NULL,
                label VARCHAR(255) NOT NULL,
                num VARCHAR(255) NOT NULL,
                dice VARCHAR(255) NOT NULL
            );
            """
            self.cursor.execute(create_table_query)
            self.conn.commit()
            print("数据库初始化完成")

        except pymysql.MySQLError as e:
            print(f"数据库初始化失败：{e}")

    def save_result(self, result):
        """Insert result to database."""
        insert_query = """
        INSERT INTO res (name, res_fig, date, time, label, num, dice)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        # Unpack result properties into a tuple
        result_data = (result.name, result.res_fig, result.date, result.time, result.label, result.num, result.dice)
        self.cursor.execute(insert_query, result_data)
        self.conn.commit()

    def fetch_results_by_order(self, key='fig_id', order='ASC'):
        """Fetch all the results from database sorted by the given key.
        Args:
            key (str): The column name to sort by. Default is 'fig_id'.
            order (str): Sorting order, either 'ASC' or 'DESC'. Default is 'ASC'.
        Returns:
            List[DetectResult]: A list of DetectResult objects.
        """
        allowed_keys = {'fig_id', 'name', 'date'}
        if key not in allowed_keys:
            raise ValueError(f"Invalid sort key: {key}")

        fetch_query = f"SELECT * FROM res ORDER BY {key} {order}"
        self.cursor.execute(fetch_query)
        rows = self.cursor.fetchall()
    
        results = [DetectResult.from_db_row(*row) for row in rows]
        return results

    def truncate_database(self):
        truncate_query = "TRUNCATE `res`"
        self.cursor.execute(truncate_query)
        self.conn.commit()

    def close(self):
        if self.conn:
            self.cursor.close()
            self.conn.close()
            print("数据库连接已关闭")


class DetectResult:
    def __init__(self, name, res_fig, date, time, label, num, dice, fig_id=None):
        self.name = name
        self.res_fig = res_fig
        self.date = date
        self.time = time
        self.label = label
        self.num = num
        self.dice = dice
        self.fig_id = fig_id

    @classmethod
    def from_db_row(cls, fig_id, name, res_fig, date, time, label, num, dice):
        """Create DetectResult from database row where fig_id is first"""
        return cls(name, res_fig, date, time, label, num, dice, fig_id)


class DetectObj:
    def __init__(self, name, figure, path=None):
        self.name = name
        self.figure = figure
        self.path = path
