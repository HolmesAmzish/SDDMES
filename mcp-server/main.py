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

if __name__ == "__main__":
    # Initialize and run the server
    mcp.run(transport='stdio')
