from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from datetime import datetime
from utilis.pred import predict
from utilis.eda import eda
import base64
import io
from PIL import Image
import os

app = Flask(__name__)
CORS(app)

# Initialize models (same as in MainWindow)
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")
class_model_path = "models/class/model_class_final 0.85.pth"
seg_model_path = "models/seg/model_FPN_final 0.899.pth"

# Load models with error handling (Only load once during app startup)
class_model = None
seg_model = None

def load_models():
    global class_model, seg_model
    try:
        class_model = torch.load(class_model_path, map_location=device, weights_only=False)
        seg_model = torch.load(seg_model_path, map_location=device, weights_only=False)
        class_model.eval()  # Set model to evaluation mode
        seg_model.eval()
    except Exception as e:
        raise RuntimeError(f"Failed to load models: {str(e)}")

# Load models during startup
load_models()

class APIResult:
    """Simplified result object for API responses"""
    def __init__(self, name, res_fig, time, label, num, dice):
        self.name = name
        self.res_fig = res_fig
        self.time = time
        self.label = label
        self.num = num
        self.dice = dice
    
    def to_dict(self):
        """Convert result to dictionary for JSON response"""
        return {
            "name": self.name,
            "result_image": base64.b64encode(self.res_fig).decode('utf-8'),
            "processing_time": self.time,
            "labels": self.label,
            "defect_count": int(self.num),
            "dice": self.dice
        }

@app.route('/api/detect', methods=['POST'])
def detect():
    # Check if images are provided
    if 'images' not in request.files:
        return jsonify({"error": "No images provided"}), 400

    image_files = request.files.getlist('images')
    results = []

    for image_file in image_files:
        try:
            image_data = image_file.read()
            filename = image_file.filename or "uploaded_image.jpg"
            
            # Validate image
            try:
                Image.open(io.BytesIO(image_data)).verify()
            except Exception as e:
                return jsonify({"error": f"Invalid image data for {filename}", "details": str(e)}), 400

            # Process image
            with torch.no_grad():  # Disable gradient calculation during inference
                predicted_label, segmentation, time_cost = predict(
                    name=filename,
                    image_data=image_data,
                    model_class=class_model,
                    model_seg=seg_model,
                    mode=2
                )
            
            # Generate result image
            res_fig = eda(df=segmentation, data=image_data)
            
            # Create result object
            result = APIResult(
                name=filename,
                res_fig=res_fig,
                time=f"{time_cost:.2f}",
                label=', '.join(predicted_label['predict_label'].astype(str)),
                num=str(len(segmentation[segmentation["EncodedPixels"] != ''])),
                dice=', '.join(predicted_label['probability_label'].astype(str))
            )
            

            # Append result to list
            results.append(result.to_dict())
        
        except Exception as e:
            results.append({
                "error": f"Processing failed for {filename}",
                "details": str(e)
            })

        # Free GPU memory cache after each image
        torch.cuda.empty_cache()
        if hasattr(torch, 'cuda') and torch.cuda.is_available():
            torch.cuda.synchronize()

    return jsonify(results)

if __name__ == '__main__':
    # Create models directory if not exists
    os.makedirs("models/class", exist_ok=True)
    os.makedirs("models/seg", exist_ok=True)
    
    app.run(host='0.0.0.0', port=5000, debug=True)
