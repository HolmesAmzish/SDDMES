import os
import cv2
from torch.utils.data import  Dataset
from albumentations import (Normalize, Compose)
from albumentations.pytorch import ToTensorV2
from torch.utils.data import DataLoader
import numpy as np
from io import BytesIO
from PIL import Image
import warnings
warnings.filterwarnings('ignore')
class TestDataset_fromcsv(Dataset):
    def __init__(self, root, df, mean, std):
        self.root = root
        df['ImageId'] = df['ImageId_ClassId'].apply(lambda x: x.split('_')[0])
        self.fnames = df['ImageId'].unique().tolist()
        self.num_samples = len(self.fnames)
        self.transform = Compose(
            [
                Normalize(mean=mean, std=std, p=1),
                ToTensorV2(),
            ]
        )
    def __getitem__(self, idx):
        fname = self.fnames[idx]
        path = os.path.join(self.root, fname)
        image = cv2.imread(path)
        images = self.transform(image=image)["image"]
        return fname, images
    def __len__(self):
        return self.num_samples
    
class TestDataset_fromfig(Dataset):
    def __init__(self, root, mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)):
        self.root = root
        self.fnames = self.get_filename(root)
        self.num_samples = len(self.fnames)
        self.transform = Compose(
            [
                Normalize(mean=mean, std=std, p=1),
                ToTensorV2(),
            ]
        )
    #获得图像名    
    def get_filename(self,root):
        valid_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff']
        image_files = [f for f in os.listdir(root) if any(f.lower().endswith(ext) for ext in valid_extensions)]
        return image_files
    def __getitem__(self, idx):
        fname = self.fnames[idx]
        path = os.path.join(self.root, fname)
        image = cv2.imread(path)
        images = self.transform(image=image)["image"]
        return fname, images
    def __len__(self):
        return self.num_samples

class TestDataset_fromonefig(Dataset):
    def __init__(self, root,mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)):
        self.root = str(root)
        self.name=root.name
        self.transform = Compose(
            [
                Normalize(mean=mean, std=std, p=1),
                ToTensorV2(),
            ]
        )
    def __getitem__(self,idx):
        image = cv2.imread(self.root)
        image=np.array(image)
        images = self.transform(image=image)["image"]
        return self.name,images
    def __len__(self):
        return 1

class TestDataset_frombyte(Dataset):
    def __init__(self,data,name,mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)):
        self.data = data
        self.name=name
        self.transform = Compose(
            [
                Normalize(mean=mean, std=std, p=1),
                ToTensorV2(),
            ]
        )
    def __getitem__(self,idx):
        image = Image.open(BytesIO(self.data))
        image=np.array(image)
        images=self.transform(image=image)['image']
        return self.name,images
    def __len__(self):
        return 1


def make_dataloader(test_data_folder,image_data,mode,name,batch_size,):
    if mode==0:
        testset = DataLoader(
            TestDataset_fromonefig(test_data_folder),
            batch_size=batch_size,
            shuffle=False,
        )
        return testset
    elif mode==1:
        testset = DataLoader(
            TestDataset_fromfig(test_data_folder),
            batch_size=batch_size,
            shuffle=False,
        )
        return testset
    elif mode==2:
        testset = DataLoader(
            TestDataset_frombyte(image_data,name),
            batch_size=batch_size,
            shuffle=False,
        )
        return testset


import torch
import numpy as np
from io import BytesIO
from PIL import Image
from albumentations import Normalize, Compose
from albumentations.pytorch import ToTensorV2
from torch.utils.data import Dataset, DataLoader

def pack_binary_images(image_bytes_list, batch_size=1):
    """
    将二进制图片列表转换为 PyTorch DataLoader

    :param image_bytes_list: List[bytes]，包含多个二进制图片
    :param batch_size: DataLoader 的 batch_size
    :return: PyTorch DataLoader
    """
    class BinaryImageDataset(Dataset):
        def __init__(self, image_bytes_list, mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)):
            self.image_bytes_list = image_bytes_list
            self.transform = Compose([
                Normalize(mean=mean, std=std, p=1),
                ToTensorV2(),
            ])

        def __len__(self):
            return len(self.image_bytes_list)

        def __getitem__(self, idx):
            img_bytes = self.image_bytes_list[idx]
            image = Image.open(BytesIO(img_bytes)).convert("RGB")  # 读取二进制数据并转换为RGB
            image = np.array(image)  # 转换为NumPy数组
            image_tensor = self.transform(image=image)["image"]  # 归一化 + 转Tensor
            return image_tensor

    dataset = BinaryImageDataset(image_bytes_list)
    dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=False)
    return dataloader

