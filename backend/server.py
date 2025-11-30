from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
import qrcode
import io
import base64
import random

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT settings
JWT_SECRET = os.environ.get('JWT_SECRET', 'faberlic-mining-secret-key-2025')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24 * 30  # 30 days

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Helper functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str) -> str:
    payload = {
        'user_id': user_id,
        'exp': datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = verify_token(credentials.credentials)
    user = await db.users.find_one({'id': payload['user_id']}, {'_id': 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def generate_qr_code(data: str) -> str:
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    return base64.b64encode(buffer.getvalue()).decode()

# Models
class RegisterRequest(BaseModel):
    login: str
    password: str

class LoginRequest(BaseModel):
    login: str
    password: str

class User(BaseModel):
    id: str
    login: str
    role: str = "user"  # user or admin
    balance: float = 0.0
    daily_earnings: float = 0.0
    total_earnings: float = 0.0
    vip_level: int = 0
    deposit_amount: float = 0.0
    wallet_address: Optional[str] = None
    created_at: str
    last_login: str

class VIPLevel(BaseModel):
    level: int
    name: str
    deposit_required: float
    max_daily_earnings: float
    orders_per_day: int
    commission_per_order: float
    is_active: bool = True

class Order(BaseModel):
    id: str
    user_id: str
    product_name: str
    product_code: str
    product_price: float
    cashback: float
    qr_code: str
    status: str  # pending, completed, rejected
    created_at: str
    completed_at: Optional[str] = None

class Transaction(BaseModel):
    id: str
    user_id: str
    type: str  # deposit, withdraw, order, mining, spin, task
    amount: float
    status: str  # pending, completed, rejected
    wallet_address: Optional[str] = None
    created_at: str
    completed_at: Optional[str] = None
    admin_note: Optional[str] = None

class MiningStatus(BaseModel):
    user_id: str
    tap_count: int
    last_tap_time: Optional[str] = None
    daily_taps: int
    last_reset: str

class Notification(BaseModel):
    id: str
    title: str
    message: str
    created_at: str
    is_global: bool = True

class SpinHistory(BaseModel):
    user_id: str
    last_spin_date: str
    total_spins: int

# Auth endpoints
@api_router.post("/auth/register")
async def register(req: RegisterRequest):
    # Check if user exists
    existing = await db.users.find_one({'login': req.login}, {'_id': 0})
    if existing:
        raise HTTPException(status_code=400, detail="Login artıq mövcuddur")
    
    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    user_data = {
        'id': user_id,
        'login': req.login,
        'password': hash_password(req.password),
        'role': 'user',
        'balance': 0.0,
        'daily_earnings': 0.0,
        'total_earnings': 0.0,
        'vip_level': 0,
        'deposit_amount': 0.0,
        'wallet_address': None,
        'created_at': now,
        'last_login': now
    }
    
    await db.users.insert_one(user_data)
    
    # Initialize mining status
    mining_data = {
        'user_id': user_id,
        'tap_count': 0,
        'last_tap_time': None,
        'daily_taps': 0,
        'last_reset': now
    }
    await db.mining.insert_one(mining_data)
    
    # Initialize spin history
    spin_data = {
        'user_id': user_id,
        'last_spin_date': '',
        'total_spins': 0
    }
    await db.spins.insert_one(spin_data)
    
    token = create_token(user_id)
    user_data.pop('password')
    
    return {'token': token, 'user': user_data}

@api_router.post("/auth/login")
async def login(req: LoginRequest):
    user = await db.users.find_one({'login': req.login}, {'_id': 0})
    if not user:
        raise HTTPException(status_code=401, detail="Login və ya parol səhvdir")
    
    if not verify_password(req.password, user['password']):
        raise HTTPException(status_code=401, detail="Login və ya parol səhvdir")
    
    # Update last login
    await db.users.update_one(
        {'id': user['id']},
        {'$set': {'last_login': datetime.now(timezone.utc).isoformat()}}
    )
    
    token = create_token(user['id'])
    user.pop('password')
    
    return {'token': token, 'user': user}

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

# VIP endpoints
@api_router.get("/vip/levels")
async def get_vip_levels():
    levels = await db.vip_levels.find({}, {'_id': 0}).to_list(100)
    if not levels:
        # Initialize default VIP levels
        default_levels = [
            {'level': 1, 'name': 'VIP 1', 'deposit_required': 1000, 'max_daily_earnings': 50, 'orders_per_day': 10, 'commission_per_order': 5, 'is_active': True},
            {'level': 2, 'name': 'VIP 2', 'deposit_required': 3000, 'max_daily_earnings': 150, 'orders_per_day': 30, 'commission_per_order': 5, 'is_active': True},
            {'level': 3, 'name': 'VIP 3', 'deposit_required': 8000, 'max_daily_earnings': 500, 'orders_per_day': 100, 'commission_per_order': 5, 'is_active': True},
            {'level': 4, 'name': 'VIP 4', 'deposit_required': 15000, 'max_daily_earnings': 800, 'orders_per_day': 160, 'commission_per_order': 5, 'is_active': True},
            {'level': 5, 'name': 'VIP 5', 'deposit_required': 30000, 'max_daily_earnings': 1500, 'orders_per_day': 300, 'commission_per_order': 5, 'is_active': True},
        ]
        await db.vip_levels.insert_many(default_levels)
        levels = default_levels
    return levels

@api_router.post("/vip/upgrade")
async def upgrade_vip(current_user: dict = Depends(get_current_user)):
    levels = await db.vip_levels.find({}, {'_id': 0}).sort('level', 1).to_list(100)
    
    current_level = current_user['vip_level']
    deposit = current_user['deposit_amount']
    
    # Find highest level user qualifies for
    new_level = 0
    for level in levels:
        if deposit >= level['deposit_required'] and level['is_active']:
            new_level = level['level']
    
    if new_level > current_level:
        await db.users.update_one(
            {'id': current_user['id']},
            {'$set': {'vip_level': new_level}}
        )
        return {'success': True, 'new_level': new_level}
    
    return {'success': False, 'message': 'Kifayət qədər depozit yoxdur'}

# Order endpoints
@api_router.get("/orders/available")
async def get_available_orders(current_user: dict = Depends(get_current_user)):
    if current_user['vip_level'] == 0:
        return {'orders': [], 'message': 'VIP səviyyəsi yoxdur. Depozit edin.'}
    
    # Get VIP level details
    vip_level = await db.vip_levels.find_one({'level': current_user['vip_level']}, {'_id': 0})
    if not vip_level:
        return {'orders': [], 'message': 'VIP məlumatları tapılmadı'}
    
    # Check daily earnings limit
    today = datetime.now(timezone.utc).date().isoformat()
    
    # Reset daily earnings if new day
    user_last_reset = await db.daily_reset.find_one({'user_id': current_user['id']}, {'_id': 0})
    if not user_last_reset or user_last_reset.get('date') != today:
        await db.users.update_one(
            {'id': current_user['id']},
            {'$set': {'daily_earnings': 0}}
        )
        await db.daily_reset.update_one(
            {'user_id': current_user['id']},
            {'$set': {'date': today}},
            upsert=True
        )
        current_user['daily_earnings'] = 0
    
    if current_user['daily_earnings'] >= vip_level['max_daily_earnings']:
        return {'orders': [], 'message': 'Gündəlik limit dolub'}
    
    # Generate orders
    products = [
        {'name': 'Faberlic Expert Pharma Krem', 'base_price': 45.99, 'category': 'Kosmetika'},
        {'name': 'Oriflame The ONE Ruj', 'base_price': 18.50, 'category': 'Makeup'},
        {'name': 'Faberlic Oxygen Serum', 'base_price': 67.00, 'category': 'Dəri Baxımı'},
        {'name': 'Oriflame Eclat Parfüm', 'base_price': 89.99, 'category': 'Parfüm'},
        {'name': 'Faberlic Fitness Body Krem', 'base_price': 32.50, 'category': 'Bədən Baxımı'},
        {'name': 'Oriflame Giordani Gold Parfüm', 'base_price': 125.00, 'category': 'Parfüm'},
        {'name': 'Faberlic Expert Pharma Şampun', 'base_price': 28.75, 'category': 'Saç Baxımı'},
        {'name': 'Oriflame NovAge Serum', 'base_price': 95.50, 'category': 'Dəri Baxımı'},
        {'name': 'Faberlic Home Aromatherapy', 'base_price': 41.25, 'category': 'Ev üçün'},
        {'name': 'Oriflame The ONE İllumina', 'base_price': 22.99, 'category': 'Makeup'},
    ]
    
    orders = []
    remaining = vip_level['max_daily_earnings'] - current_user['daily_earnings']
    
    for i in range(min(3, vip_level['orders_per_day'])):
        product = random.choice(products)
        price_variation = random.uniform(0.9, 1.2)
        product_price = round(product['base_price'] * price_variation, 2)
        cashback = vip_level['commission_per_order']
        
        if cashback > remaining:
            break
        
        order_id = str(uuid.uuid4())
        product_code = f"{product['category'][:3].upper()}{random.randint(10000, 99999)}"
        qr_data = f"ORDER:{order_id}|PRODUCT:{product_code}|PRICE:{product_price}|CASHBACK:{cashback}"
        qr_code_b64 = generate_qr_code(qr_data)
        
        orders.append({
            'id': order_id,
            'product_name': product['name'],
            'product_code': product_code,
            'product_price': product_price,
            'cashback': cashback,
            'qr_code': qr_code_b64,
            'category': product['category']
        })
        remaining -= cashback
    
    return {'orders': orders, 'daily_earnings': current_user['daily_earnings'], 'max_earnings': vip_level['max_daily_earnings']}

@api_router.post("/orders/accept/{order_id}")
async def accept_order(order_id: str, current_user: dict = Depends(get_current_user)):
    # Check if order already exists
    existing = await db.orders.find_one({'id': order_id}, {'_id': 0})
    if existing:
        raise HTTPException(status_code=400, detail="Sifariş artıq qəbul edilib")
    
    # Simulate order processing
    vip_level = await db.vip_levels.find_one({'level': current_user['vip_level']}, {'_id': 0})
    if not vip_level:
        raise HTTPException(status_code=400, detail="VIP məlumatları tapılmadı")
    
    cashback = vip_level['commission_per_order']
    now = datetime.now(timezone.utc).isoformat()
    
    # Update balances
    new_balance = current_user['balance'] + cashback
    new_daily = current_user['daily_earnings'] + cashback
    new_total = current_user['total_earnings'] + cashback
    
    await db.users.update_one(
        {'id': current_user['id']},
        {'$set': {
            'balance': new_balance,
            'daily_earnings': new_daily,
            'total_earnings': new_total
        }}
    )
    
    # Create order record
    order_data = {
        'id': order_id,
        'user_id': current_user['id'],
        'product_name': 'Order Product',
        'product_code': f"ORD{random.randint(10000, 99999)}",
        'product_price': cashback * 20,
        'cashback': cashback,
        'qr_code': '',
        'status': 'completed',
        'created_at': now,
        'completed_at': now
    }
    await db.orders.insert_one(order_data)
    
    # Create transaction
    tx_data = {
        'id': str(uuid.uuid4()),
        'user_id': current_user['id'],
        'type': 'order',
        'amount': cashback,
        'status': 'completed',
        'created_at': now,
        'completed_at': now
    }
    await db.transactions.insert_one(tx_data)
    
    return {'success': True, 'cashback': cashback, 'new_balance': new_balance}

@api_router.post("/orders/reject/{order_id}")
async def reject_order(order_id: str, current_user: dict = Depends(get_current_user)):
    # Just return success after 60 second wait notification
    return {'success': True, 'wait_time': 60}

# Mining endpoints
@api_router.get("/mining/status")
async def get_mining_status(current_user: dict = Depends(get_current_user)):
    mining = await db.mining.find_one({'user_id': current_user['id']}, {'_id': 0})
    if not mining:
        now = datetime.now(timezone.utc).isoformat()
        mining = {
            'user_id': current_user['id'],
            'tap_count': 0,
            'last_tap_time': None,
            'daily_taps': 0,
            'last_reset': now
        }
        await db.mining.insert_one(mining)
    
    # Check if we need to reset (6 hour window)
    if mining['last_tap_time']:
        last_tap = datetime.fromisoformat(mining['last_tap_time'])
        now = datetime.now(timezone.utc)
        hours_passed = (now - last_tap).total_seconds() / 3600
        
        if hours_passed >= 6:
            # Reset tap count
            await db.mining.update_one(
                {'user_id': current_user['id']},
                {'$set': {'tap_count': 0}}
            )
            mining['tap_count'] = 0
    
    return mining

@api_router.post("/mining/tap")
async def tap_mining(current_user: dict = Depends(get_current_user)):
    mining = await db.mining.find_one({'user_id': current_user['id']}, {'_id': 0})
    if not mining:
        raise HTTPException(status_code=404, detail="Mining məlumatları tapılmadı")
    
    # Check if we need to reset
    if mining['last_tap_time']:
        last_tap = datetime.fromisoformat(mining['last_tap_time'])
        now = datetime.now(timezone.utc)
        hours_passed = (now - last_tap).total_seconds() / 3600
        
        if hours_passed >= 6:
            mining['tap_count'] = 0
    
    if mining['tap_count'] >= 500:
        raise HTTPException(status_code=400, detail="Gündəlik limit dolub. 6 saat sonra yenidən cəhd edin.")
    
    # Add tap
    now = datetime.now(timezone.utc).isoformat()
    new_tap_count = mining['tap_count'] + 1
    reward = 0.01
    
    new_balance = current_user['balance'] + reward
    new_total = current_user['total_earnings'] + reward
    
    await db.mining.update_one(
        {'user_id': current_user['id']},
        {'$set': {
            'tap_count': new_tap_count,
            'last_tap_time': now,
            'daily_taps': mining.get('daily_taps', 0) + 1
        }}
    )
    
    await db.users.update_one(
        {'id': current_user['id']},
        {'$set': {
            'balance': new_balance,
            'total_earnings': new_total
        }}
    )
    
    # Create transaction
    tx_data = {
        'id': str(uuid.uuid4()),
        'user_id': current_user['id'],
        'type': 'mining',
        'amount': reward,
        'status': 'completed',
        'created_at': now,
        'completed_at': now
    }
    await db.transactions.insert_one(tx_data)
    
    return {'success': True, 'tap_count': new_tap_count, 'reward': reward, 'new_balance': new_balance, 'remaining': 500 - new_tap_count}

# Spin endpoints
@api_router.post("/spin/daily")
async def daily_spin(current_user: dict = Depends(get_current_user)):
    today = datetime.now(timezone.utc).date().isoformat()
    
    spin = await db.spins.find_one({'user_id': current_user['id']}, {'_id': 0})
    if not spin:
        spin = {'user_id': current_user['id'], 'last_spin_date': '', 'total_spins': 0}
        await db.spins.insert_one(spin)
    
    if spin['last_spin_date'] == today:
        raise HTTPException(status_code=400, detail="Bu gün artıq çarx çevirdiniz")
    
    # Rewards: 0.5, 1, 2, 5, 10, 20 USDT
    rewards = [0.5, 1, 1, 2, 2, 5, 5, 10]
    reward = random.choice(rewards)
    
    now = datetime.now(timezone.utc).isoformat()
    new_balance = current_user['balance'] + reward
    new_total = current_user['total_earnings'] + reward
    
    await db.spins.update_one(
        {'user_id': current_user['id']},
        {'$set': {
            'last_spin_date': today,
            'total_spins': spin['total_spins'] + 1
        }}
    )
    
    await db.users.update_one(
        {'id': current_user['id']},
        {'$set': {
            'balance': new_balance,
            'total_earnings': new_total
        }}
    )
    
    # Create transaction
    tx_data = {
        'id': str(uuid.uuid4()),
        'user_id': current_user['id'],
        'type': 'spin',
        'amount': reward,
        'status': 'completed',
        'created_at': now,
        'completed_at': now
    }
    await db.transactions.insert_one(tx_data)
    
    return {'success': True, 'reward': reward, 'new_balance': new_balance}

# Transaction endpoints
@api_router.post("/transactions/deposit")
async def create_deposit(amount: float, current_user: dict = Depends(get_current_user)):
    if amount < 1000:
        raise HTTPException(status_code=400, detail="Minimum depozit 1,000 USDT")
    
    tx_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    tx_data = {
        'id': tx_id,
        'user_id': current_user['id'],
        'type': 'deposit',
        'amount': amount,
        'status': 'pending',
        'wallet_address': 'gLxo79237ALFOBQdmoq',
        'created_at': now,
        'completed_at': None
    }
    await db.transactions.insert_one(tx_data)
    
    return {'success': True, 'transaction_id': tx_id, 'wallet_address': 'gLxo79237ALFOBQdmoq'}

@api_router.post("/transactions/withdraw")
async def create_withdrawal(amount: float, wallet_address: str, current_user: dict = Depends(get_current_user)):
    if amount < 250:
        raise HTTPException(status_code=400, detail="Minimum çıxarış 250 USDT")
    
    if current_user['balance'] < amount:
        raise HTTPException(status_code=400, detail="Kifayət qədər balans yoxdur")
    
    tx_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    # Deduct from balance immediately
    new_balance = current_user['balance'] - amount
    await db.users.update_one(
        {'id': current_user['id']},
        {'$set': {'balance': new_balance}}
    )
    
    tx_data = {
        'id': tx_id,
        'user_id': current_user['id'],
        'type': 'withdraw',
        'amount': amount,
        'status': 'pending',
        'wallet_address': wallet_address,
        'created_at': now,
        'completed_at': None
    }
    await db.transactions.insert_one(tx_data)
    
    return {'success': True, 'transaction_id': tx_id, 'new_balance': new_balance}

@api_router.get("/transactions/history")
async def get_transaction_history(current_user: dict = Depends(get_current_user)):
    transactions = await db.transactions.find(
        {'user_id': current_user['id']},
        {'_id': 0}
    ).sort('created_at', -1).to_list(100)
    return transactions

# Admin endpoints
@api_router.get("/admin/users")
async def get_all_users(current_user: dict = Depends(get_current_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin icazəsi tələb olunur")
    
    users = await db.users.find({}, {'_id': 0, 'password': 0}).sort('created_at', -1).to_list(1000)
    return users

@api_router.put("/admin/vip-levels/{level}")
async def update_vip_level(level: int, vip_data: dict, current_user: dict = Depends(get_current_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin icazəsi tələb olunur")
    
    await db.vip_levels.update_one(
        {'level': level},
        {'$set': vip_data},
        upsert=True
    )
    
    return {'success': True}

@api_router.get("/admin/withdrawals")
async def get_pending_withdrawals(current_user: dict = Depends(get_current_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin icazəsi tələb olunur")
    
    withdrawals = await db.transactions.find(
        {'type': 'withdraw', 'status': 'pending'},
        {'_id': 0}
    ).sort('created_at', -1).to_list(100)
    
    # Get user info for each withdrawal
    for w in withdrawals:
        user = await db.users.find_one({'id': w['user_id']}, {'_id': 0, 'login': 1})
        w['user_login'] = user['login'] if user else 'Unknown'
    
    return withdrawals

@api_router.post("/admin/withdrawals/{tx_id}/approve")
async def approve_withdrawal(tx_id: str, current_user: dict = Depends(get_current_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin icazəsi tələb olunur")
    
    now = datetime.now(timezone.utc).isoformat()
    
    result = await db.transactions.update_one(
        {'id': tx_id},
        {'$set': {'status': 'completed', 'completed_at': now}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Transaction tapılmadı")
    
    return {'success': True}

@api_router.post("/admin/withdrawals/{tx_id}/reject")
async def reject_withdrawal(tx_id: str, note: str = "", current_user: dict = Depends(get_current_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin icazəsi tələb olunur")
    
    # Get transaction to refund balance
    tx = await db.transactions.find_one({'id': tx_id}, {'_id': 0})
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction tapılmadı")
    
    now = datetime.now(timezone.utc).isoformat()
    
    # Refund balance
    await db.users.update_one(
        {'id': tx['user_id']},
        {'$inc': {'balance': tx['amount']}}
    )
    
    # Update transaction
    await db.transactions.update_one(
        {'id': tx_id},
        {'$set': {'status': 'rejected', 'completed_at': now, 'admin_note': note}}
    )
    
    return {'success': True}

@api_router.post("/admin/deposits/{tx_id}/approve")
async def approve_deposit(tx_id: str, current_user: dict = Depends(get_current_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin icazəsi tələb olunur")
    
    tx = await db.transactions.find_one({'id': tx_id}, {'_id': 0})
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction tapılmadı")
    
    now = datetime.now(timezone.utc).isoformat()
    
    # Add to balance and deposit amount
    await db.users.update_one(
        {'id': tx['user_id']},
        {'$inc': {'balance': tx['amount'], 'deposit_amount': tx['amount']}}
    )
    
    # Update transaction
    await db.transactions.update_one(
        {'id': tx_id},
        {'$set': {'status': 'completed', 'completed_at': now}}
    )
    
    return {'success': True}

@api_router.post("/admin/notifications")
async def create_notification(title: str, message: str, current_user: dict = Depends(get_current_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin icazəsi tələb olunur")
    
    notif_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    notif_data = {
        'id': notif_id,
        'title': title,
        'message': message,
        'created_at': now,
        'is_global': True
    }
    await db.notifications.insert_one(notif_data)
    
    return {'success': True, 'notification_id': notif_id}

@api_router.get("/notifications")
async def get_notifications(current_user: dict = Depends(get_current_user)):
    notifications = await db.notifications.find(
        {'is_global': True},
        {'_id': 0}
    ).sort('created_at', -1).limit(10).to_list(10)
    return notifications

@api_router.get("/admin/stats")
async def get_admin_stats(current_user: dict = Depends(get_current_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin icazəsi tələb olunur")
    
    total_users = await db.users.count_documents({})
    pending_withdrawals = await db.transactions.count_documents({'type': 'withdraw', 'status': 'pending'})
    pending_deposits = await db.transactions.count_documents({'type': 'deposit', 'status': 'pending'})
    
    # Calculate total platform balance
    pipeline = [
        {'$group': {'_id': None, 'total': {'$sum': '$balance'}}}
    ]
    result = await db.users.aggregate(pipeline).to_list(1)
    total_balance = result[0]['total'] if result else 0
    
    return {
        'total_users': total_users,
        'pending_withdrawals': pending_withdrawals,
        'pending_deposits': pending_deposits,
        'total_platform_balance': total_balance
    }

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
