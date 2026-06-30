import subprocess
import os
import time
import shutil

os.chdir('/tmp/CommunityNotificationsApiDocs')

# Kill existing servers
subprocess.run(['pkill', '-f', 'node test-server.js'], capture_output=True, text=True)
time.sleep(1)

# Clean test artifacts
shutil.rmtree('test-results', ignore_errors=True)
shutil.rmtree('playwright-report', ignore_errors=True)

# Rebuild
result = subprocess.run(['npm', 'run', 'build'], capture_output=True, text=True, timeout=120)
print(f"BUILD: {'OK' if result.returncode == 0 else 'FAILED'}")
if result.returncode != 0:
    print(result.stderr[-1000:])
    exit(1)

# Verify asset paths
with open('.vitepress/dist/index.html', 'r') as f:
    content = f.read()

import re
links = re.findall(r'(?:href|src)="([^"]*(?:js|css|svg|woff)[^"]*)"', content)
print("\n=== Asset paths in built HTML ===")
for link in sorted(set(links)):
    print(f"  {link}")

has_prefix = all('/CommunityNotificationsApiDocs/' in l for l in links)
print(f"\nAll assets have subpath prefix: {has_prefix}")

# Start test server
proc = subprocess.Popen(['node', 'test-server.js'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(2)

# Verify server
import http.client
try:
    conn = http.client.HTTPConnection('127.0.0.1', 8765, timeout=5)
    conn.request('GET', '/')
    resp = conn.getresponse()
    print(f"\nServer check: {resp.status}")
    conn.close()
except Exception as e:
    print(f"Server check failed: {e}")

# Run tests
result = subprocess.run(['npx', 'playwright', 'test'], capture_output=True, text=True, timeout=600)
proc.terminate()
proc.wait()

# Count pass/fail
pass_count = result.stdout.count('✓')
fail_count = result.stdout.count('✘')
print(f"\nTests: {pass_count} passed, {fail_count} failed")
print(f"Exit code: {result.returncode}")