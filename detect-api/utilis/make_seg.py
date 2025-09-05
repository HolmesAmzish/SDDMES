import os
import sys
import time

current_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.dirname(os.path.dirname(current_dir))
sys.path.insert(0, project_dir)

import numpy as np
import pandas as pd
import torch
from tqdm import tqdm
from utilis.process import post_process, mask2rle


def null_augment(input): return input


def flip_lr_augment(input): return torch.flip(input, dims=[2])


def flip_ud_augment(input): return torch.flip(input, dims=[3])


def null_inverse_augment(logit): return logit


def flip_lr_inverse_augment(logit): return torch.flip(logit, dims=[2])


def flip_ud_inverse_augment(logit): return torch.flip(logit, dims=[3])


augment = (
    (null_augment, null_inverse_augment),
    (flip_lr_augment, flip_lr_inverse_augment),
    (flip_ud_augment, flip_ud_inverse_augment),
)


def get_seg_preds(model, testset, df_label, threshold_pixel=[0.5, 0.5, 0.5, 0.5, ], min_size=[200, 1500, 1500, 2000]):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    model.eval()
    predictions = []
    for i, batch in enumerate(tqdm(testset)):
        start_time = time.time()
        fnames, images = batch
        images = images.to(device)
        batch_preds = 0
        probabilities = []
        for k, (a, inv_a) in enumerate(augment):
            logit = model(a(images))
            p = inv_a(torch.sigmoid(logit))
            if k == 0:
                probability = p ** 0.5
            else:
                probability += p ** 0.5
        probability = probability / len(augment)
        probabilities.append(probability)

        batch_preds += probability
        batch_preds = batch_preds.data.cpu().numpy()
        for fname, preds in zip(fnames, batch_preds):
            for cls, pred in enumerate(preds):
                pred, num = post_process(pred, threshold_pixel[cls], min_size[cls])
                rle = mask2rle(pred)
                name = fname + f"_{cls + 1}"
                predictions.append([name, rle])
        time_seg = time.time() - start_time
    df_mask = pd.DataFrame(predictions, columns=['ImageId_ClassId', 'EncodedPixels'])
    df_mask = df_mask.sort_values(by='ImageId_ClassId').reset_index(drop=True)
    df_label = df_label.sort_values(by='ImageId_ClassId').reset_index(drop=True)
    assert (np.all(df_mask['ImageId_ClassId'].values == df_label['ImageId_ClassId'].values))
    df_mask.loc[df_label['EncodedPixels'] == '', 'EncodedPixels'] = ''
    # df_mask.to_csv(r"result\seg_res.csv", index=False)
    return df_mask, time_seg
