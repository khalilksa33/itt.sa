#!/usr/bin/env python3
import os
import json
import re
import urllib.request
import urllib.parse

# Colors for terminal styling
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
RESET = "\033[0m"
BOLD = "\033[1m"

def log_info(msg):
    print(f"{YELLOW}[INFO]{RESET} {msg}")

def log_success(msg):
    print(f"{GREEN}[SUCCESS]{RESET} {msg}")

def log_error(msg):
    print(f"{RED}[ERROR]{RESET} {msg}")

def parse_php_config(config_path):
    """
    Parses ERPNext API parameters out of the config.php file
    """
    if not os.path.exists(config_path):
        return None

    with open(config_path, 'r') as f:
        content = f.read()

    # Search for ERPNext credentials definitions
    url_match = re.search(r"define\('ERP_URL',\s*'([^']+)'\);", content)
    key_match = re.search(r"define\('API_KEY',\s*'([^']+)'\);", content)
    secret_match = re.search(r"define\('API_SECRET',\s*'([^']+)'\);", content)

    if url_match and key_match and secret_match:
        return {
            "url": url_match.group(1),
            "key": key_match.group(1),
            "secret": secret_match.group(1)
        }
    return None

def make_erpnext_request(url, endpoint, credentials, method="POST", data=None):
    """
    Sends an authenticated REST call to ERPNext API
    """
    full_url = f"{url.rstrip('/')}/api/resource/{urllib.parse.quote(endpoint)}"
    headers = {
        "Authorization": f"token {credentials['key']}:{credentials['secret']}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    req = urllib.request.Request(
        full_url,
        data=json.dumps(data).encode('utf-8') if data else None,
        headers=headers,
        method=method
    )

    try:
        with urllib.request.urlopen(req) as res:
            response_data = json.loads(res.read().decode('utf-8'))
            return 200, response_data
    except urllib.error.HTTPError as e:
        try:
            err_data = json.loads(e.read().decode('utf-8'))
        except Exception:
            err_data = e.reason
        return e.code, err_data
    except Exception as e:
        return 500, str(e)

def main():
    print(f"{BOLD}=== ERPNext Automation: Sub-Agents & Sales Setup ==={RESET}\n")

    # Load configuration
    config_file_path = os.path.join(os.path.dirname(__file__), "../includes/config.php")
    credentials = parse_php_config(config_file_path)

    if not credentials or "your-erpnext-url.com" in credentials["url"]:
        log_info("Active website config.php not configured. Please supply ERPNext credentials manually.")
        erp_url = input("Enter ERPNext Server URL (e.g. http://localhost:8000): ").strip()
        api_key = input("Enter API Key: ").strip()
        api_secret = input("Enter API Secret: ").strip()
        credentials = {"url": erp_url, "key": api_key, "secret": api_secret}

    log_info(f"Targeting ERPNext server: {credentials['url']}")

    # 1. Load Sub Agent DocType Schema
    schema_path = os.path.join(os.path.dirname(__file__), "doctype_sub_agent.json")
    if not os.path.exists(schema_path):
        log_error("doctype_sub_agent.json schema file missing!")
        return

    with open(schema_path, 'r') as f:
        sub_agent_schema = json.load(f)

    # 2. Check and Create Custom DocType: Sub Agent
    log_info("Registering custom DocType 'Sub Agent' in ERPNext...")
    code, res = make_erpnext_request(credentials['url'], "DocType", credentials, method="POST", data=sub_agent_schema)

    if code == 200:
        log_success("Custom DocType 'Sub Agent' successfully registered!")
    elif code == 409 or (isinstance(res, dict) and "DuplicateEntryError" in str(res)):
        log_success("DocType 'Sub Agent' already exists in ERPNext.")
    else:
        log_error(f"Failed to register DocType. HTTP Code {code}. Response: {res}")
        log_info("Please verify your API key privileges (System Manager role required).")

    # 3. Create custom fields in Umrah Booking
    booking_custom_fields = [
        {
            "dt": "Umrah Booking",
            "fieldname": "custom_sub_agent",
            "label": "Sub-Agent Partner",
            "fieldtype": "Link",
            "options": "Sub Agent",
            "insert_after": "customer",
            "is_custom_field": 1
        },
        {
            "dt": "Umrah Booking",
            "fieldname": "custom_booking_mode",
            "label": "B2B Booking Mode",
            "fieldtype": "Select",
            "options": "Standard\nReseller",
            "default": "Standard",
            "insert_after": "custom_sub_agent",
            "is_custom_field": 1
        },
        {
            "dt": "Umrah Booking",
            "fieldname": "custom_resale_price",
            "label": "Sub-Agent Resale Price",
            "fieldtype": "Currency",
            "insert_after": "custom_booking_mode",
            "is_custom_field": 1
        }
    ]

    log_info("Creating custom referral/reseller fields in DocType 'Umrah Booking'...")
    for field in booking_custom_fields:
        code, res = make_erpnext_request(credentials['url'], "Custom Field", credentials, method="POST", data=field)
        fieldname = field['fieldname']
        if code == 200:
            log_success(f"Custom Field '{fieldname}' added to Umrah Booking.")
        elif code == 409 or (isinstance(res, dict) and "Duplicate" in str(res)):
            log_success(f"Custom Field '{fieldname}' already exists.")
        else:
            log_error(f"Failed to add '{fieldname}'. HTTP Code {code}. Response: {res}")

    print(f"\n{BOLD}{GREEN}=== Setup Script Completed ==={RESET}")
    print("Your ERPNext system is now configured to track Sub-Agents and their reseller pricing.")

if __name__ == "__main__":
    main()
