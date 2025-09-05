import torch
from datetime import datetime
from utilis.pred import predict
from utilis.eda import eda
from PIL import Image
import io
import os

# Initialize device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")

# Model paths
class_model_path = "models/class/model_class_final 0.85.pth"
seg_model_path = "models/seg/model_FPN_final 0.899.pth"

# Load models
def load_models():
    try:
        class_model = torch.load(class_model_path, map_location=device, weights_only=False)
        seg_model = torch.load(seg_model_path, map_location=device, weights_only=False)
        class_model.eval()
        seg_model.eval()
        return class_model, seg_model
    except Exception as e:
        raise RuntimeError(f"Failed to load models: {str(e)}")

class_model, seg_model = load_models()

def run_inference(image_path: str):
    """Run classification + segmentation on a single image"""
    with open(image_path, "rb") as f:
        image_data = f.read()

    # Check image validity
    try:
        Image.open(io.BytesIO(image_data)).verify()
    except Exception as e:
        print(f"[ERROR] Invalid image: {image_path} -> {e}")
        return

    # Run prediction
    with torch.no_grad():
        predicted_label, segmentation, time_cost = predict(
            name=os.path.basename(image_path),
            image_data=image_data,
            model_class=class_model,
            model_seg=seg_model,
            mode=2
        )

    # Visualization
    res_fig = eda(df=segmentation, data=image_data)

    # Show results
    print("======== Inference Result ========")
    print(f"Image: {image_path}")
    print(f"Time cost: {time_cost:.2f} s")
    print(f"Predicted labels: {predicted_label['predict_label'].astype(str).tolist()}")
    print(f"Probabilities: {predicted_label['probability_label'].astype(str).tolist()}")
    print(f"Defect count: {len(segmentation[segmentation['EncodedPixels'] != ''])}")

    # Save visualization
    output_path = f"result_{os.path.basename(image_path)}.png"
    with open(output_path, "wb") as f:
        f.write(res_fig)
    print(f"Result visualization saved to {output_path}")

    # Free GPU memory
    torch.cuda.empty_cache()
    if torch.cuda.is_available():
        torch.cuda.synchronize()

if __name__ == "__main__":
    test_img = "/home/cacc/Repositories/SteelDefectDetection/data/test_images/0a2c9f2e5.jpg"
    run_inference(test_img)
