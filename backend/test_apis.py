"""
Backend API Testing Script
Tests all backend endpoints and external API integrations
"""
import sys
import time
import requests
from colorama import init, Fore, Style
from config import FLASK_CONFIG, GURBANI_API_URL

# Initialize colorama for colored terminal output
init(autoreset=True)

class APITester:
    def __init__(self):
        self.base_url = f"http://{FLASK_CONFIG['host']}:{FLASK_CONFIG['port']}"
        self.results = []

    def print_header(self, text):
        """Print a formatted header"""
        print(f"\n{Fore.CYAN}{'=' * 60}")
        print(f"{Fore.CYAN}{text}")
        print(f"{Fore.CYAN}{'=' * 60}\n")

    def print_test(self, name, passed, message, duration=None):
        """Print test result"""
        icon = f"{Fore.GREEN}✓" if passed else f"{Fore.RED}✗"
        duration_str = f" ({duration:.0f}ms)" if duration else ""
        print(f"{icon} {name}{duration_str}")
        print(f"  {Fore.WHITE}{message}")

        self.results.append({
            'name': name,
            'passed': passed,
            'message': message,
            'duration': duration
        })

    def test_health_endpoint(self):
        """Test the /health endpoint"""
        start_time = time.time()

        try:
            response = requests.get(f"{self.base_url}/health", timeout=5)
            duration = (time.time() - start_time) * 1000

            if response.status_code == 200:
                data = response.json()
                self.print_test(
                    "Health Check Endpoint",
                    True,
                    f"Service is healthy: {data.get('service', 'Unknown')}",
                    duration
                )
                return True
            else:
                self.print_test(
                    "Health Check Endpoint",
                    False,
                    f"HTTP {response.status_code}",
                    duration
                )
                return False
        except requests.exceptions.ConnectionError:
            self.print_test(
                "Health Check Endpoint",
                False,
                "Cannot connect to backend server. Is it running?"
            )
            return False
        except Exception as e:
            self.print_test(
                "Health Check Endpoint",
                False,
                f"Error: {str(e)}"
            )
            return False

    def test_gurbani_api(self):
        """Test GurbaniNow API connectivity"""
        start_time = time.time()

        try:
            # Test with Mool Mantar (Shabad ID 1)
            response = requests.get(
                f"{GURBANI_API_URL}/shabad/1",
                headers={'Accept': 'application/json'},
                timeout=10
            )
            duration = (time.time() - start_time) * 1000

            if response.status_code == 200:
                data = response.json()
                line_count = len(data.get('shabad', []))
                self.print_test(
                    "GurbaniNow API",
                    True,
                    f"Successfully fetched Shabad (1) with {line_count} lines",
                    duration
                )
                return True
            else:
                self.print_test(
                    "GurbaniNow API",
                    False,
                    f"HTTP {response.status_code}",
                    duration
                )
                return False
        except Exception as e:
            self.print_test(
                "GurbaniNow API",
                False,
                f"Error: {str(e)}"
            )
            return False

    def test_multiple_shabads(self):
        """Test fetching multiple Shabads"""
        test_ids = ['1', '3589', '1365']
        successes = 0
        total_duration = 0

        for shabad_id in test_ids:
            start_time = time.time()
            try:
                response = requests.get(
                    f"{GURBANI_API_URL}/shabad/{shabad_id}",
                    timeout=10
                )
                duration = (time.time() - start_time) * 1000
                total_duration += duration

                if response.status_code == 200:
                    successes += 1
            except Exception:
                pass

        passed = successes == len(test_ids)
        self.print_test(
            "Multiple Shabads Test",
            passed,
            f"{successes}/{len(test_ids)} Shabads fetched successfully",
            total_duration / len(test_ids)
        )
        return passed

    def test_response_time(self):
        """Test API response time"""
        iterations = 3
        times = []

        for _ in range(iterations):
            start_time = time.time()
            try:
                response = requests.get(f"{self.base_url}/health", timeout=5)
                if response.status_code == 200:
                    times.append((time.time() - start_time) * 1000)
            except Exception:
                pass

        if times:
            avg_time = sum(times) / len(times)
            max_time = max(times)
            min_time = min(times)
            passed = avg_time < 1000  # Pass if under 1 second

            self.print_test(
                "Response Time Test",
                passed,
                f"Avg: {avg_time:.0f}ms | Min: {min_time:.0f}ms | Max: {max_time:.0f}ms",
                avg_time
            )
            return passed
        else:
            self.print_test(
                "Response Time Test",
                False,
                "Failed to measure response time"
            )
            return False

    def test_error_handling(self):
        """Test error handling for invalid requests"""
        start_time = time.time()

        try:
            # Test with invalid Shabad ID
            response = requests.get(
                f"{GURBANI_API_URL}/shabad/999999",
                timeout=10
            )
            duration = (time.time() - start_time) * 1000

            # Should return 404 or similar error
            if response.status_code in [404, 400, 500]:
                self.print_test(
                    "Error Handling Test",
                    True,
                    f"Correctly returned error status {response.status_code}",
                    duration
                )
                return True
            else:
                self.print_test(
                    "Error Handling Test",
                    False,
                    f"Unexpected status: {response.status_code}",
                    duration
                )
                return False
        except Exception as e:
            self.print_test(
                "Error Handling Test",
                False,
                f"Error: {str(e)}"
            )
            return False

    def run_all_tests(self):
        """Run all tests"""
        self.print_header("🧪 Backend API Test Suite")

        print(f"{Fore.YELLOW}Testing backend server at: {self.base_url}")
        print(f"{Fore.YELLOW}Testing GurbaniNow API at: {GURBANI_API_URL}\n")

        # Run tests
        tests = [
            self.test_health_endpoint,
            self.test_gurbani_api,
            self.test_multiple_shabads,
            self.test_response_time,
            self.test_error_handling
        ]

        for test in tests:
            test()
            print()  # Spacing

        # Print summary
        self.print_summary()

    def run_smoke_test(self):
        """Run essential tests only"""
        self.print_header("🔥 Backend Smoke Test")

        tests = [
            self.test_health_endpoint,
            self.test_gurbani_api
        ]

        for test in tests:
            test()
            print()

        self.print_summary()

    def print_summary(self):
        """Print test summary"""
        self.print_header("📊 Test Summary")

        total = len(self.results)
        passed = sum(1 for r in self.results if r['passed'])
        failed = total - passed
        pass_rate = (passed / total * 100) if total > 0 else 0

        print(f"{Fore.CYAN}Total Tests:  {total}")
        print(f"{Fore.GREEN}Passed:       {passed}")
        print(f"{Fore.RED}Failed:       {failed}")
        print(f"{Fore.YELLOW}Pass Rate:    {pass_rate:.1f}%\n")

        if passed == total:
            print(f"{Fore.GREEN}✅ All tests passed!")
        else:
            print(f"{Fore.RED}❌ Some tests failed. Please review the results above.")


def main():
    """Main entry point"""
    tester = APITester()

    if len(sys.argv) > 1 and sys.argv[1] == '--smoke':
        tester.run_smoke_test()
    else:
        tester.run_all_tests()

    # Exit with error code if any tests failed
    passed = sum(1 for r in tester.results if r['passed'])
    total = len(tester.results)

    if passed < total:
        sys.exit(1)
    else:
        sys.exit(0)


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n{Fore.YELLOW}Tests interrupted by user")
        sys.exit(1)
