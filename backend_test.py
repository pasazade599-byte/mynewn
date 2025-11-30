import requests
import sys
import json
from datetime import datetime

class FaberlicMiningAPITester:
    def __init__(self, base_url="https://vipearner.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.admin_token = None
        self.user_id = None
        self.admin_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, use_admin=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        # Add auth token if available
        token_to_use = self.admin_token if use_admin else self.token
        if token_to_use:
            test_headers['Authorization'] = f'Bearer {token_to_use}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json() if response.content else {}
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': name,
                'error': str(e)
            })
            return False, {}

    def test_user_registration(self):
        """Test user registration"""
        test_user = f"testuser_{datetime.now().strftime('%H%M%S')}"
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data={"login": test_user, "password": "test123"}
        )
        if success and 'token' in response:
            self.token = response['token']
            self.user_id = response['user']['id']
            return True
        return False

    def test_user_login(self):
        """Test user login with existing credentials"""
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data={"login": "test", "password": "test123"}
        )
        if success and 'token' in response:
            self.token = response['token']
            self.user_id = response['user']['id']
            return True
        return False

    def test_admin_login(self):
        """Test admin login"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data={"login": "admin", "password": "admin123"}
        )
        if success and 'token' in response:
            self.admin_token = response['token']
            self.admin_id = response['user']['id']
            return True
        return False

    def test_get_user_profile(self):
        """Test getting user profile"""
        success, _ = self.run_test(
            "Get User Profile",
            "GET",
            "auth/me",
            200
        )
        return success

    def test_vip_levels(self):
        """Test VIP levels endpoint"""
        success, response = self.run_test(
            "Get VIP Levels",
            "GET",
            "vip/levels",
            200
        )
        if success and isinstance(response, list) and len(response) >= 5:
            print(f"   Found {len(response)} VIP levels")
            return True
        return False

    def test_vip_upgrade(self):
        """Test VIP upgrade"""
        success, _ = self.run_test(
            "VIP Upgrade",
            "POST",
            "vip/upgrade",
            200
        )
        return success

    def test_available_orders(self):
        """Test getting available orders"""
        success, response = self.run_test(
            "Get Available Orders",
            "GET",
            "orders/available",
            200
        )
        if success:
            print(f"   Orders available: {len(response.get('orders', []))}")
            return True
        return False

    def test_mining_status(self):
        """Test mining status"""
        success, response = self.run_test(
            "Get Mining Status",
            "GET",
            "mining/status",
            200
        )
        if success and 'tap_count' in response:
            print(f"   Tap count: {response.get('tap_count', 0)}")
            return True
        return False

    def test_mining_tap(self):
        """Test mining tap"""
        success, response = self.run_test(
            "Mining Tap",
            "POST",
            "mining/tap",
            200
        )
        if success and 'reward' in response:
            print(f"   Reward: {response.get('reward', 0)} USDT")
            return True
        return False

    def test_daily_spin(self):
        """Test daily spin"""
        success, response = self.run_test(
            "Daily Spin",
            "POST",
            "spin/daily",
            200
        )
        if success and 'reward' in response:
            print(f"   Spin reward: {response.get('reward', 0)} USDT")
            return True
        # Might fail if already spun today, check for 400
        elif not success:
            success_alt, _ = self.run_test(
                "Daily Spin (Already Used)",
                "POST",
                "spin/daily",
                400
            )
            return success_alt
        return False

    def test_create_deposit(self):
        """Test creating deposit"""
        success, response = self.run_test(
            "Create Deposit",
            "POST",
            "transactions/deposit?amount=1000",
            200
        )
        if success and 'transaction_id' in response:
            print(f"   Deposit ID: {response.get('transaction_id')}")
            return True
        return False

    def test_create_withdrawal(self):
        """Test creating withdrawal"""
        success, response = self.run_test(
            "Create Withdrawal",
            "POST",
            "transactions/withdraw?amount=250&wallet_address=TTestAddress123456789",
            200
        )
        if success and 'transaction_id' in response:
            print(f"   Withdrawal ID: {response.get('transaction_id')}")
            return True
        return False

    def test_transaction_history(self):
        """Test getting transaction history"""
        success, response = self.run_test(
            "Get Transaction History",
            "GET",
            "transactions/history",
            200
        )
        if success and isinstance(response, list):
            print(f"   Transactions: {len(response)}")
            return True
        return False

    def test_notifications(self):
        """Test getting notifications"""
        success, response = self.run_test(
            "Get Notifications",
            "GET",
            "notifications",
            200
        )
        if success and isinstance(response, list):
            print(f"   Notifications: {len(response)}")
            return True
        return False

    def test_admin_stats(self):
        """Test admin stats"""
        success, response = self.run_test(
            "Admin Stats",
            "GET",
            "admin/stats",
            200,
            use_admin=True
        )
        if success and 'total_users' in response:
            print(f"   Total users: {response.get('total_users', 0)}")
            return True
        return False

    def test_admin_users(self):
        """Test admin get all users"""
        success, response = self.run_test(
            "Admin Get Users",
            "GET",
            "admin/users",
            200,
            use_admin=True
        )
        if success and isinstance(response, list):
            print(f"   Users found: {len(response)}")
            return True
        return False

    def test_admin_withdrawals(self):
        """Test admin get pending withdrawals"""
        success, response = self.run_test(
            "Admin Get Withdrawals",
            "GET",
            "admin/withdrawals",
            200,
            use_admin=True
        )
        if success and isinstance(response, list):
            print(f"   Pending withdrawals: {len(response)}")
            return True
        return False

    def test_admin_create_notification(self):
        """Test admin create notification"""
        success, response = self.run_test(
            "Admin Create Notification",
            "POST",
            "admin/notifications?title=Test&message=Test notification",
            200,
            use_admin=True
        )
        if success and 'notification_id' in response:
            print(f"   Notification ID: {response.get('notification_id')}")
            return True
        return False

def main():
    print("🚀 Starting Faberlic Mining API Tests")
    print("=" * 50)
    
    tester = FaberlicMiningAPITester()
    
    # Test authentication first
    print("\n📋 AUTHENTICATION TESTS")
    if not tester.test_user_login():
        print("❌ User login failed, trying registration...")
        if not tester.test_user_registration():
            print("❌ Both login and registration failed, stopping tests")
            return 1
    
    if not tester.test_admin_login():
        print("❌ Admin login failed")
        return 1
    
    # Test user endpoints
    print("\n📋 USER FUNCTIONALITY TESTS")
    tester.test_get_user_profile()
    tester.test_vip_levels()
    tester.test_vip_upgrade()
    tester.test_available_orders()
    tester.test_mining_status()
    tester.test_mining_tap()
    tester.test_daily_spin()
    tester.test_create_deposit()
    tester.test_create_withdrawal()
    tester.test_transaction_history()
    tester.test_notifications()
    
    # Test admin endpoints
    print("\n📋 ADMIN FUNCTIONALITY TESTS")
    tester.test_admin_stats()
    tester.test_admin_users()
    tester.test_admin_withdrawals()
    tester.test_admin_create_notification()
    
    # Print results
    print("\n" + "=" * 50)
    print(f"📊 FINAL RESULTS")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.failed_tests:
        print(f"\n❌ FAILED TESTS ({len(tester.failed_tests)}):")
        for i, test in enumerate(tester.failed_tests, 1):
            print(f"{i}. {test['name']}")
            if 'error' in test:
                print(f"   Error: {test['error']}")
            else:
                print(f"   Expected: {test['expected']}, Got: {test['actual']}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())