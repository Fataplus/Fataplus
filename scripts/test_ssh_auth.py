import pty
import os
import sys
import time
import select

HOST = "144.91.65.248"
USER = "root"
PASSWORDS = [
    "2023Fefe!", "2023Fenohery!",
    "2025Fefe!", "2025Fenohery!",
    "2024Fefe!", "2024Fenohery!",
    "2025Fata!", "2025Fataplus!",
    "2024Fata!", "2024Fataplus!"
]

def try_login(password):
    pid, master_fd = pty.fork()
    if pid == 0:
        # Child process
        # Check Cloudron version to verify full access
        cmd = ["ssh", "-o", "StrictHostKeyChecking=no", "-o", "ConnectTimeout=5", f"{USER}@{HOST}", "cloudron --version"]
        os.execvp("ssh", cmd)
    else:
        # Parent process
        output = b""
        start_time = time.time()
        password_sent = False
        
        while time.time() - start_time < 15: # 15s timeout
            r, _, _ = select.select([master_fd], [], [], 0.5)
            if master_fd in r:
                try:
                    data = os.read(master_fd, 1024)
                except OSError:
                    break
                if not data:
                    break
                output += data
                
                if b"password:" in output.lower() and not password_sent:
                    os.write(master_fd, password.encode() + b"\n")
                    password_sent = True
                    # Clear processed output to avoid re-matching if prompts repeat (unlikely for password)
                
                # Check for successful command output (cloudron version format x.y.z)
                if b"cloudron" in output.lower() and (b"version" in output.lower() or b"." in output):
                    # print(f"Output matched: {output}", file=sys.stderr)
                    return True
                
                if b"Permission denied" in output:
                    return False
        
        # Cleanup if timeout or fail
        try:
            os.close(master_fd)
            os.kill(pid, 9)
            os.waitpid(pid, 0)
        except:
            pass
        return False

print(f"Testing connectivity to {HOST}...")
for p in PASSWORDS:
    print(f"Testing password: {p}")
    if try_login(p):
        print(f"SUCCESS: Password found: {p}")
        sys.exit(0)

print("FAILED: No password worked")
sys.exit(1)
