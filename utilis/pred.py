import os
import sys
import torch.backends.cudnn as cudnn
import warnings
from utilis.dataset import make_dataloader, pack_binary_images
from utilis.make_class import get_classification_preds
from utilis.make_seg import get_seg_preds

warnings.filterwarnings('ignore')
cudnn.benchmark = True


def predict(name=None, image_data=None, mode=None, path=None, model_class=None, model_seg=None):
    """
    Args:
        name: Figure name
        image_data: Figure binary data
        mode: 0, Predict by single figure path; 1, Predict by figure folder path; 2, Predict by figure binary data
        path: Figure or Folder path
        model_class: PyTorch model object
        model_seg: PyTorch model object
    Returns:
        probability_label:
        df_segmentation: DataFrame of segmentation
        time_class + time_seg: Total time cost
    """
    test_data_folder = path
    testset = make_dataloader(test_data_folder, image_data, mode, name, batch_size=1)
    probability_label, df_classification,time_class = get_classification_preds(model_class, testset)
    df_segmentation, time_seg =get_seg_preds(model_seg, testset, df_classification)
    return probability_label, df_segmentation, time_class + time_seg
