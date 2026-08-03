# Setup New Home

If you want to completely wipe the NexAware system to start fresh for a new home, you need to clear out the PostgreSQL database volume and delete the physical files in your `Documents` folder.

> [!WARNING]
> **CRITICAL WARNING:** You must be careful **NOT** to blindly wipe all Docker volumes (like running `docker compose down -v`), otherwise you will delete the downloaded AI models (Llama 3) and you will have to wait a long time to re-download them!

Here is the exact step-by-step PowerShell script to safely wipe only your user data and start completely fresh. Run these commands from the root of your project directory (`c:\WorkSpace\AI\HomeBot\nexaware-home-ai`).

### 1. Stop the application
This gracefully shuts down all containers so files aren't locked.
```powershell
docker compose down
```

### 2. Wipe the Database
This deletes the specific volume holding the PostgreSQL data (wiping all chat history, household items, and document database records).
```powershell
docker volume rm nexaware-home-ai_postgres_data
```

### 3. Wipe the Uploaded Files
This deletes all the physical PDF and text files inside your mounted Documents folder, while keeping the folder itself intact.
```powershell
Remove-Item -Path .\Documents\* -Recurse -Force
```

### 4. Restart the Application
When the server starts back up, it will see the database is missing and will automatically generate a brand new, empty one.
```powershell
docker compose up -d
```

That's it! After running step 4, if you refresh your browser, you will have a 100% clean slate for your new home.
