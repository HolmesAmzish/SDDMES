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
    """Result object matching backend DefectDetectionResult model"""
    def __init__(self, name, res_fig, time_cost, predicted_label, segmentation):
        self.name = name
        self.res_fig = res_fig
        self.time_cost = time_cost
        self.predicted_label = predicted_label
        self.segmentation = segmentation
    
    def to_dict(self):
        """Convert result to dictionary matching DefectDetectionResult model"""
        try:
            # Parse predicted labels to boolean flags from DataFrame
            # predicted_label is a DataFrame with columns: ['ImageId', 'probability_label', 'predict_label']
            predict_label_row = self.predicted_label.iloc[0]  # Get first row (should be only one)
            
            # Extract the predict_label array (numpy array)
            predict_labels = predict_label_row['predict_label']
            
            # Convert numpy array values to Python booleans safely
            has_inclusion = bool(predict_labels[0]) if len(predict_labels) > 0 else False
            has_patch = bool(predict_labels[1]) if len(predict_labels) > 1 else False
            has_scratch = bool(predict_labels[2]) if len(predict_labels) > 2 else False
            has_other = bool(predict_labels[3]) if len(predict_labels) > 3 else False
            
            # Calculate defect number from segmentation DataFrame
            defect_number = len(self.segmentation[self.segmentation["EncodedPixels"] != ''])
            
            # Convert probability labels to string safely
            prob_labels = predict_label_row['probability_label']
            if hasattr(prob_labels, 'astype'):
                detect_confidences = ', '.join([f"{x:.4f}" for x in prob_labels])
            else:
                detect_confidences = str(prob_labels)
            
            return {
                "detectConfidences": detect_confidences,
                "defectNumber": defect_number,
                "timeCost": float(self.time_cost),
                "hasInclusion": has_inclusion,
                "hasPatch": has_patch,
                "hasScratch": has_scratch,
                "hasOther": has_other,
                "resultFigure": base64.b64encode(self.res_fig).decode('utf-8') if self.res_fig else None
            }
        except Exception as e:
            # Return error information if processing fails
            import traceback
            return {
                "error": f"Result processing failed: {str(e)}",
                "details": f"Predicted label shape: {self.predicted_label.shape if hasattr(self.predicted_label, 'shape') else 'N/A'}, Segmentation shape: {self.segmentation.shape if hasattr(self.segmentation, 'shape') else 'N/A'}",
                "traceback": traceback.format_exc()
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
                time_cost=time_cost,
                predicted_label=predicted_label,
                segmentation=segmentation
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
