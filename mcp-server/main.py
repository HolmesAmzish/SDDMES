from typing import Any
import httpx
from mcp.server.fastmcp import FastMCP

# Initialize FastMCP server
mcp = FastMCP("sddmes")

@mcp.tool()
async def add_work_order(work_order_no: str, production_quantity: float, product_item_id: int, bom_id: int):
    """
    Add a new work order to the system.
    
    Args:
        work_order_no: The work order number (unique identifier)
        production_quantity: The quantity to produce
        product_item_id: The ID of the product item
        bom_id: The ID of the BOM (Bill of Materials)
    
    Returns:
        Success message or error details
    """
    # Construct the request payload
    payload = {
        "workOrderNo": work_order_no,
        "productionQuantity": production_quantity,
        "productItem": {"id": product_item_id},
        "bom": {"id": bom_id}
    }
    
    # Backend API URL
    url = "http://localhost:8080/api/workorder/add"
    
    try:
        # Send POST request to backend
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, timeout=30.0)
            
        if response.status_code == 200:
            return {"status": "success", "message": "Work order added successfully"}
        else:
            return {"status": "error", "message": f"Backend returned status {response.status_code}", "details": response.text}
    
    except httpx.RequestError as e:
        return {"status": "error", "message": f"Request failed: {str(e)}"}
    except Exception as e:
        return {"status": "error", "message": f"Unexpected error: {str(e)}"}

@mcp.tool()
async def get_work_orders():
    """
    Get all work orders from the system.
    
    Returns:
        List of work orders or error details
    """
    # Backend API URL
    url = "http://localhost:8080/api/workorder/get"
    
    try:
        # Send GET request to backend
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=30.0)
            
        if response.status_code == 200:
            return {"status": "success", "data": response.json()}
        else:
            return {"status": "error", "message": f"Backend returned status {response.status_code}", "details": response.text}
    
    except httpx.RequestError as e:
        return {"status": "error", "message": f"Request failed: {str(e)}"}
    except Exception as e:
        return {"status": "error", "message": f"Unexpected error: {str(e)}"}

@mcp.tool()
async def add_defect_detection_result(
    batch_id: int,
    has_inclusion: bool = False,
    has_patch: bool = False,
    has_scratch: bool = False,
    has_other: bool = False,
    time_cost: float = 0.0,
    defect_number: int = 0,
    detect_confidences: str = "",
    result_figure_base64: str = None
):
    """
    Add a new defect detection result to the system.
    
    Args:
        batch_id: The ID of the associated batch
        has_inclusion: Whether inclusion defects are detected
        has_patch: Whether patch defects are detected
        has_scratch: Whether scratch defects are detected
        has_other: Whether other defects are detected
        time_cost: Time taken for detection in seconds
        defect_number: Number of defects detected
        detect_confidences: JSON string of detection confidences
        result_figure_base64: Base64 encoded image data of the result figure (optional)
    
    Returns:
        Success message or error details
    """
    # Construct the request payload
    payload = {
        "batch": {"id": batch_id},
        "hasInclusion": has_inclusion,
        "hasPatch": has_patch,
        "hasScratch": has_scratch,
        "hasOther": has_other,
        "timeCost": time_cost,
        "defectNumber": defect_number,
        "detectConfidences": detect_confidences
    }
    
    # Add result figure if provided
    if result_figure_base64:
        payload["resultFigure"] = result_figure_base64
    
    # Backend API URL
    url = "http://localhost:8080/api/detection/add"
    
    try:
        # Send POST request to backend
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, timeout=30.0)
            
        if response.status_code == 200:
            return {"status": "success", "message": "Defect detection result added successfully"}
        else:
            return {"status": "error", "message": f"Backend returned status {response.status_code}", "details": response.text}
    
    except httpx.RequestError as e:
        return {"status": "error", "message": f"Request failed: {str(e)}"}
    except Exception as e:
        return {"status": "error", "message": f"Unexpected error: {str(e)}"}

@mcp.tool()
async def get_defect_detection_result_by_id(result_id: int):
    """
    Get a specific defect detection result by ID.
    
    Args:
        result_id: The ID of the defect detection result
    
    Returns:
        Defect detection result data or error details
    """
    # Backend API URL
    url = f"http://localhost:8080/api/detection/query/{result_id}"
    
    try:
        # Send GET request to backend
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=30.0)
            
        if response.status_code == 200:
            return {"status": "success", "data": response.json()}
        else:
            return {"status": "error", "message": f"Backend returned status {response.status_code}", "details": response.text}
    
    except httpx.RequestError as e:
        return {"status": "error", "message": f"Request failed: {str(e)}"}
    except Exception as e:
        return {"status": "error", "message": f"Unexpected error: {str(e)}"}

@mcp.tool()
async def get_all_defect_detection_results():
    """
    Get all defect detection results without any filtering parameters.
    This directly calls the query URL with no parameters, letting the backend handle defaults.
    
    Returns:
        All defect detection results or error details
    """
    # Backend API URL
    url = "http://localhost:8080/api/detection/query"
    
    try:
        # Send GET request to backend with no parameters
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=30.0)
            
        if response.status_code == 200:
            return {"status": "success", "data": response.json()}
        else:
            return {"status": "error", "message": f"Backend returned status {response.status_code}", "details": response.text}
    
    except httpx.RequestError as e:
        return {"status": "error", "message": f"Request failed: {str(e)}"}
    except Exception as e:
        return {"status": "error", "message": f"Unexpected error: {str(e)}"}

@mcp.tool()
async def query_defect_detection_results(
    start_time: str = None,
    end_time: str = None,
    keyword: str = None,
    has_inclusion: bool = None,
    has_patch: bool = None,
    has_scratch: bool = None,
    has_other: bool = None,
    page: int = 0,
    size: int = 20
):
    """
    Query defect detection results with filtering and pagination.
    
    Args:
        start_time: Start time for filtering (ISO format: YYYY-MM-DDTHH:MM:SS)
        end_time: End time for filtering (ISO format: YYYY-MM-DDTHH:MM:SS)
        keyword: Keyword search in results
        has_inclusion: Filter by inclusion defects
        has_patch: Filter by patch defects
        has_scratch: Filter by scratch defects
        has_other: Filter by other defects
        page: Page number (0-based)
        size: Page size
    
    Returns:
        Paginated defect detection results or error details
    """
    # Build query parameters
    params = {
        "page": page,
        "size": size
    }
    
    if start_time:
        params["start"] = start_time
    if end_time:
        params["end"] = end_time
    if keyword:
        params["keyword"] = keyword
    if has_inclusion is not None:
        params["hasInclusion"] = str(has_inclusion).lower()
    if has_patch is not None:
        params["hasPatch"] = str(has_patch).lower()
    if has_scratch is not None:
        params["hasScratch"] = str(has_scratch).lower()
    if has_other is not None:
        params["hasOther"] = str(has_other).lower()
    
    # Backend API URL
    url = "http://localhost:8080/api/detection/query"
    
    try:
        # Send GET request to backend
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=30.0)
            
        if response.status_code == 200:
            return {"status": "success", "data": response.json()}
        else:
            return {"status": "error", "message": f"Backend returned status {response.status_code}", "details": response.text}
    
    except httpx.RequestError as e:
        return {"status": "error", "message": f"Request failed: {str(e)}"}
    except Exception as e:
        return {"status": "error", "message": f"Unexpected error: {str(e)}"}

if __name__ == "__main__":
    # Initialize and run the server
    mcp.run(transport='stdio')
