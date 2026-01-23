# Manual Migration Instructions

We have successfully established an HTTP Bridge on O2Switch, but the Cloudron container itself is blocked from accessing the internet (Firewall issue).
To bypass this, please run the migration script directly from the **Cloudron Host** (which should have unrestricted internet access).

## Steps

1.  **Open Terminal** on your local machine.
## Steps (VNC / Console Access)

The VNC access you provided (`213.136.74.143:63253` pass `2026Fata`) is working. As I cannot access the GUI directly, please:

1.  **Connect to VNC**: Use your VNC Viewer (or Hosting Console) with the credentials:
    *   **IP**: `213.136.74.143`
    *   **Port**: `63253`
    *   **Password**: `2026Fata`

2.  **Open Terminal**: Once logged in (GUI), find and open the "Terminal" application.

3.  **Run the Migration Helper**:
    Type the following command (I've hosted the script for you to avoid typing):

    ```bash
    wget http://roxi8838.odns.fr/backupcloudron/host_migration.sh && chmod +x host_migration.sh && ./host_migration.sh
    ```

    *Tip: If you can't copy-paste into VNC, type carefully. It downloads the script and runs it.*

4.  **Monitor Progress**:
    You should see "Streaming /app/data...".
    Watch the dashboard at: http://roxi8838.odns.fr/bridge_upload.php

5.  **Monitor Progress**:
    The script will dump the database and stream the files directly to O2Switch.
    You can watch the progress on the dashboard: http://roxi8838.odns.fr/bridge_upload.php

## What if this fails?
If the script fails on the host, please **Download the Backup** from the Cloudron Dashboard (Web UI) ~> Apps ~> WordPress ~> Backups, and upload it manually to `documents/Fataplus/` locally, then notify me.
