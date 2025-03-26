from io import BytesIO
import io
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import os
from pathlib import Path
from PIL import Image
import cv2
plt.ioff()

def name_and_mask(df):
    img_names = [str(i).split('_')[0] for i in df.iloc[0:4, 0].values]
    labels = df.iloc[0:4, 1]
    mask = np.zeros((256, 1600, 4), dtype=np.uint8)
    for idx, label in enumerate(labels.values):
        if not pd.isna(label):
            mask_label = np.zeros(1600 * 256, dtype=np.uint8)
            label = label.split(" ")
            
            label = [item for item in label if item.strip()]
            pos = map(int, label[0::2])
            lengths = map(int, label[1::2]) 
            for p, l in zip(pos, lengths):
                mask_label[p-1:p+l-1] = 1
            mask[:, :, idx] = mask_label.reshape(256, 1600, order='F')
    return img_names[0], mask

def eda(df, data=None, path=None):
    """Exploratory data analysis with defect type annotations
    Args:
        df: Segmentation DataFrame
        data: Figure binary data
        path: Path of raw figure
    Return:
        binary_data: Binary data of result figure
    """
    df['ImageId'] = df['ImageId_ClassId'].apply(lambda x: x.split('_')[0])
    df['ClassId'] = df['ImageId_ClassId'].apply(lambda x: x.split('_')[1])
    df['hashMask'] = ~df['EncodedPixels'].isnull()
    mask_count_df = df.groupby('ImageId').agg(np.sum).reset_index()
    mask_count_df.sort_values('hashMask', ascending=False, inplace=True)
    
    palet = [(249, 192, 12), (0, 185, 241), (114, 0, 218), (249, 50, 12)]
    defect_dict = ["Inclusion", "Patch", "Scratch", "Other"]

    name, mask = name_and_mask(df)
    if data is not None:
        stream = io.BytesIO(data)
        img = Image.open(stream)
        img = np.array(img)
    elif path is not None:
        img = cv2.imread(str(path))
        img = np.array(img)

    for ch in range(4):
        contours, _ = cv2.findContours(mask[:, :, ch], cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
        if contours:
            cv2.drawContours(img, contours, -1, palet[ch], 2)  # 绘制边界
            M = cv2.moments(contours[0])
            if M["m00"] != 0:
                cX = int(M["m10"] / M["m00"])
                cY = int(M["m01"] / M["m00"])
            else:
                cX, cY = contours[0][0][0]
            text = defect_dict[ch]
            font = cv2.FONT_HERSHEY_SIMPLEX
            font_scale = 0.8
            thickness = 2
            text_color = palet[ch]
            text_position = (cX, cY - 10)
            cv2.putText(img, text, text_position, font, font_scale, text_color, thickness, cv2.LINE_AA)

    _, img_encoded = cv2.imencode('.jpg', img)
    binary_data = img_encoded.tobytes()

    return binary_data