import time
import numpy as np
import pandas as pd
import torch
from tqdm import tqdm


def sharpen(p,t=0.5):
        if t!=0:
            return p**t
        else:
            return p


def get_classification_preds(model, test_loader, threshold_label = [0.6, 0.6, 0.6, 0.6]):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    model.eval() 
    test_probability_label = []
    test_id   = []
    start_time=time.time()
    for t, (fnames, images) in enumerate(tqdm(test_loader)):
        images = images.to(device)
        with torch.no_grad():
            model.eval()
            num_augment = 0
            if 1: #  null
                logit =  model(images)
                probability = torch.sigmoid(logit)
                probability_label = sharpen(probability,0)
                num_augment+=1
            probability_label = probability_label/num_augment
        probability_label = probability_label.data.cpu().numpy()
        test_probability_label.append(probability_label)
        test_id.extend([i for i in fnames])
    time_class=time.time()-start_time
    test_probability_label = np.concatenate(test_probability_label,axis=0)
    predict_label = test_probability_label > np.array(threshold_label)
    image_id_class_id = []
    encoded_pixel = []
    for b in range(len(test_id)):
        for c in range(4):
            image_id_class_id.append(test_id[b] + '_%d' % (c + 1))
            if predict_label[b, c] == 0:
                rle = ''
            else:
                rle = '1 1'
            encoded_pixel.append(rle)
    probability_label = pd.DataFrame(zip(test_id, test_probability_label,predict_label), columns=['ImageId', 'probability_label','predict_label'])
    # probability_label.to_csv(r"result\class_res.csv", index=False)
    df_label = pd.DataFrame(zip(image_id_class_id, encoded_pixel), columns=['ImageId_ClassId', 'EncodedPixels'])
    return probability_label,df_label,time_class