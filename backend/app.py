from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import os
import httpx
from cachetools import TTLCache

load_dotenv()

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")
RAPIDAPI_HOST = os.getenv("RAPIDAPI_HOST")
if not (RAPIDAPI_KEY and RAPIDAPI_HOST):
    raise RuntimeError("RAPIDAPI_KEY or RAPIDAPI_HOST missing in .env")

app = FastAPI(title="sol_dex_viewer proxy")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TokenBalance(BaseModel):
    tokenName: str
    tokenSymbol: str
    amount: float
    usdValue: float

class StakingBalance(BaseModel):
    stakingAccount: str
    amount: float
    usdValue: float

class PortfolioResponse(BaseModel):
    tokenBalances: list[TokenBalance] = Field(default_factory=list)
    stakingBalances: list[StakingBalance] = Field(default_factory=list)
    nftBalances: int = 0
    totalValue: float

cache = TTLCache(maxsize=512, ttl=20)
client = httpx.AsyncClient(
    timeout=10.0,
    headers={
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
    },
)

@app.on_event("shutdown")
async def shutdown_event():
    await client.aclose()

@app.get("/api/sol/total_balance", response_model=PortfolioResponse)
async def total_balance(address: str = Query(..., min_length=3)):
    addr = address.strip()
    if not addr:
        raise HTTPException(status_code=400, detail="address is required")

    if addr in cache:
        return cache[addr]

    try:
        r = await client.get(
            f"https://{RAPIDAPI_HOST}/user/total_balance",
            params={"address": addr},
        )
        data = r.json()
    except Exception:
        raise HTTPException(status_code=500, detail="Upstream request failed")

    if r.status_code == 400:
        raise HTTPException(status_code=400, detail=data.get("error", "Bad request"))
    if r.status_code >= 500:
        raise HTTPException(status_code=502, detail="Upstream server error")

    parsed = PortfolioResponse(**data)
    cache[addr] = parsed
    return parsed
