import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from services.llm import parse_user_intent, generate_route_explanation
from services.routing import geocode_destination, fetch_candidate_routes
from services.scoring import fetch_active_reports, score_routes

load_dotenv(dotenv_path="../.env")

app = FastAPI(title="Nirapod AI Route Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RouteRequest(BaseModel):
    query: str
    current_lat: float
    current_lng: float

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/api/route")
async def get_safe_route(req: RouteRequest):
    try:
        # 1. Grok API parses intent
        intent = await parse_user_intent(req.query)
        dest_name = intent.get("destination")
        mode = intent.get("mode", "driving")
        preferences = intent.get("preferences", [])
        
        if not dest_name:
            return {"status": "error", "message": "Could not determine destination."}
            
        # 2. Geocode destination
        coords = await geocode_destination(dest_name, req.current_lat, req.current_lng)
        if not coords:
            return {"status": "error", "message": f"Could not locate {dest_name}."}
            
        dest_lat, dest_lng = coords
        
        # 3. Fetch base routes from OSRM
        candidates = await fetch_candidate_routes(
            req.current_lat, req.current_lng, 
            dest_lat, dest_lng, 
            mode
        )
        
        if not candidates:
            return {"status": "error", "message": "No routes found."}
            
        # 4. Fetch Supabase hazard reports & Score routes
        reports = fetch_active_reports()
        best_route = score_routes(candidates, reports, preferences)
        
        if not best_route:
            return {"status": "error", "message": "Failed to score routes."}
            
        # 5. Grok API explains the route
        explanation = await generate_route_explanation(req.query, {
            "destination": dest_name,
            "mode": mode,
            "safety_score": best_route.get("safety_score"),
            "hazards_encountered": best_route.get("hazards_encountered", []),
            "duration_mins": round(best_route.get("duration", 0) / 60)
        })
        
        return {
            "status": "success",
            "destination": dest_name,
            "mode": mode,
            "route": best_route, # Contains geometry, distance, duration
            "all_routes": candidates, # Optional for frontend rendering
            "explanation": explanation
        }
    except Exception as e:
        print(f"Error processing route: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
