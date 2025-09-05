import pdb
import os
import cv2
from sklearn.model_selection import train_test_split
import torch
import pandas as pd
import numpy as np
from tqdm import tqdm
import torch.backends.cudnn as cudnn
from torch.utils.data import DataLoader, Dataset
from albumentations import (Resize, Normalize, Compose,RandomCrop,HorizontalFlip,VerticalFlip,Sharpen,Rotate,GaussianBlur)
from albumentations.pytorch import ToTensorV2
import torchvision.models as models
import torch.nn as nn
from torch import optim
from torch.optim import lr_scheduler
import warnings
cudnn.benchmark = True
warnings.filterwarnings('ignore')

df = pd.read_csv(r"data\train.csv")
train_defect = df[df["EncodedPixels"].notnull()]

master_df = pd.DataFrame()
master_df["Image_Class"]=train_defect["ImageId_ClassId"]
def image_id(row):
    return row['Image_Class'].strip().split("_")[0]
def class_id(row):
    return row["Image_Class"].strip().split("_")[1]
master_df["ImageId"] = master_df.apply(image_id,axis=1)
master_df["ClassId"] = master_df.apply(class_id,axis=1)
master_df = master_df.drop(["Image_Class"],axis=1)
master_df = master_df.reset_index()
master_df = master_df.drop(["index"] , axis=1)

train_df,test_df=train_test_split(master_df,test_size=0.2,stratify=master_df['ClassId'],random_state=42)
class Dataset_Classifier(Dataset):
    def __init__(self, root, df,transform):
        self.root = root
        self.df = df
        self.df = df.reset_index(drop=True)
        self.num_samples = len(self.df)
        self.transform = transform
    def __getitem__(self,idx):
        fname = self.df["ImageId"][idx]
        path = os.path.join(self.root, fname)
        image = cv2.imread(path)
        images = self.transform(image=image)["image"]
        label = self.df["ClassId"][idx]
        return images, torch.from_numpy(np.array([int(label)-1],dtype=np.float32))
    def __len__(self):
        return self.num_samples
train_transform = Compose(
    [
        RandomCrop(256,512),
        HorizontalFlip(p=0.5),  # 水平翻转
        VerticalFlip(p=0.5),  # 垂直翻转
        Rotate(limit=30, p=0.5),  # 随机旋转，角度范围为 -30 到 30 度
        GaussianBlur(3,p=0.3),
        Sharpen(alpha=(0.2, 0.3), p=0.3),
        Normalize(mean = [0.485, 0.456, 0.406],std =[0.229, 0.224, 0.225], p=1),
        ToTensorV2(),
    ])
test_transforms = Compose(
    [
        Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),  # 归一化
        ToTensorV2(),  # 转换为 Tensor
    ])
    
train_data_folder = r"data\train_images"
train_dataset = Dataset_Classifier(train_data_folder,train_df,transform=train_transform)
val_dataset = Dataset_Classifier(train_data_folder,test_df,transform=test_transforms)
train_dataloader = DataLoader(train_dataset,shuffle = True,batch_size = 16)
val_dataloader = DataLoader(val_dataset,shuffle = False,batch_size = 16)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = models.resnext50_32x4d(pretrained=True)
num_ftrs = model.fc.in_features
model.fc = nn.Linear(num_ftrs, 4)
model = model.to(device)
criterion = nn.CrossEntropyLoss()
optimizer = optim.AdamW(model.parameters(),  lr=0.0001)
scheduler = lr_scheduler.StepLR(optimizer, step_size=7, gamma=0.1)

class EarlyStopping:
    def __init__(self, patience=5, delta=0, path='checkpoint.pt'):
        self.patience = patience
        self.delta = delta
        self.path = path
        self.best_score = None
        self.counter = 0
        self.early_stop = False
        self.val_loss_min = np.Inf
    def save_checkpoint(self, val_loss, model):
        #torch.save(model.state_dict(), self.path)
        torch.save(model,self.path)
        self.val_loss_min = val_loss
    def __call__(self, val_loss, model):
        score = -val_loss

        if self.best_score is None:
            self.best_score = score
            self.save_checkpoint(val_loss, model)
        elif score < self.best_score + self.delta:
            self.counter += 1
            print(f'EarlyStopping counter: {self.counter} out of {self.patience}')
            if self.counter >= self.patience:
                self.early_stop = True
        else:
            self.best_score = score
            self.save_checkpoint(val_loss, model)
            self.counter = 0
def train_epoch(dataloader, model,criterion,optimizer):
    model.train()
    running_loss = 0
    total_samples = 0
    accuracy = 0
    for idx,(inputs, labels) in enumerate(tqdm(dataloader)):
        inputs=inputs.to(device)
        labels=labels.to(device)
        
        optimizer.zero_grad()
        outputs = model(inputs)
        labels=labels.squeeze().long()

        loss = criterion(outputs, labels)
        loss.backward()
        
        optimizer.step()
        running_loss += loss.item() * inputs.size(0)
        total_samples += inputs.size(0)
        
        ps = torch.exp(outputs).data
        equality = (labels.data == ps.max(1)[1])
        accuracy += equality.type_as(torch.FloatTensor()).mean()
    epoch_loss = running_loss / total_samples
    epoch_acc = accuracy /len(dataloader)
    torch.cuda.empty_cache()
    return epoch_loss,epoch_acc  # 返回标量值
def validate_epoch(dataloader, model,criterion):
    model.eval()
    running_loss = 0
    total_samples = 0
    accuracy = 0
    with torch.no_grad():
        for idx,(inputs, labels) in enumerate(tqdm(dataloader)):
            inputs = inputs.to(device)
            labels = labels.to(device)
            
            outputs = model(inputs)
            labels=labels.squeeze().long()
            loss = criterion(outputs, labels)
            
            running_loss += loss.item() * inputs.size(0)
            total_samples += inputs.size(0)
            
            ps = torch.exp(outputs).data
            equality = (labels.data == ps.max(1)[1])
            accuracy += equality.type_as(torch.FloatTensor()).mean()
    
    epoch_loss = running_loss / total_samples
    epoch_acc = accuracy /len(dataloader)
    torch.cuda.empty_cache()
    return epoch_loss, epoch_acc

num_epochs = 30
train_loss_list = []
train_acc_list = []
val_loss_list = []
val_acc_list = []
early_stopping = EarlyStopping(patience=8, delta=0.0001, path=r'models\class\model_class_final.pth')

for epoch in range(1, num_epochs + 1):
    print('=' * 20, 'Epoch', epoch, '=' * 20)
    train_loss,train_acc = train_epoch(train_dataloader,model,criterion,optimizer,epoch)
    train_loss_list.append(train_loss)
    train_acc_list.append(train_acc)
    val_loss, val_acc = validate_epoch(val_dataloader, model,criterion)
    val_loss_list.append(val_loss)
    val_acc_list.append(val_acc)
    print(f'Train Loss: {train_loss:.6f}, Train acc: {train_acc:.6f}')
    print(f'Val Loss: {val_loss:.6f}, Val acc: {val_acc:.6f}')
    scheduler.step(val_loss)
    early_stopping(val_loss, model)
    
    if early_stopping.early_stop:
        print(f"Early stopping，{epoch}")
        break
    