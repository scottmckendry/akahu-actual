# Akahu to Actual Budget 🚀

A dead-simple script that connects the brilliant [Akahu API](https://akahu.nz/) to the equally brilliant [Actual Budget](https://actualbudget.org/) app.

An ideal solution for Kiwis who want to use Actual Budget to manage their finances, but find the manual import process a bit tedious.

## 🔑 Prerequisites

- An Akahu account with a configured personal app ([see Akuhu's documentation](https://developers.akahu.nz/docs/personal-apps))
- Docker (recommended) or Node.js

> [!NOTE]
> Only the **Transactions** permission is required in your Akahu app settings.

## ⚡ How it Works

1. Connects to the Akahu API using your personal app and user tokens
2. Pulls transactions from all connected accounts, mapping them to their corresponding Actual Budget accounts
3. Transforms the transactions into a format that Actual Budget can understand
4. Pushes the transactions to Actual Budget using its API

## 🛠️ Configuration

Create an `.env` file in the with the following settings:

```bash
# Akahu API Credentials
AKAHU_APP_TOKEN=app_token_abcd
AKAHU_USER_TOKEN=user_token_1234

# Account Mappings
# Format: {"akahu_account_id": "actual_account_id"}
# - Akahu IDs: Found in URL when viewing account on my.akahu.nz (format: acc_xxx...)
# - Actual IDs: Found in URL when viewing account in Actual Budget (GUID format)
ACCOUNT_MAPPINGS={"akahu_account_id_1":"actual_account_id_1", "akahu_account_id_2":"actual_account_id_2"}

# Actual Budget Configuration
ACTUAL_SERVER_URL=http://localhost:5006    # URL of your Actual server
ACTUAL_PASSWORD=password                   # Your Actual master password
ACTUAL_SYNC_ID=00000000-0000-0000-0000-000000000000  # Found in Settings -> Advanced Settings

# Optional Settings
DAYS_TO_FETCH=7  # Number of days of transaction history to fetch (default: 7)
ACTUAL_E2E_ENCRYPTION_PASSWORD=password # Actual E2E encryption password, if enabled (default: undefined)
```

## 🚀 Deployment Options

### Option 1: Docker Compose (Recommended)

Create a `docker-compose.yml` file:

```yaml
services:
    actual_server:
        container_name: actual_server
        image: docker.io/actualbudget/actual-server:latest
        ports:
            - "5006:5006"
        volumes:
            - ./actual-data:/data
        restart: unless-stopped
        healthcheck:
            test: ["CMD-SHELL", "node src/scripts/health-check.js"]
            interval: 60s
            timeout: 10s
            retries: 3
            start_period: 20s

    akahu-actual:
        container_name: akahu-actual
        image: ghcr.io/scottmckendry/akahu-actual
        env_file:
            - .env
        depends_on:
            actual_server:
                condition: service_healthy
```

> [!TIP]
> The `akahu-actual` container runs once and exits. To run it again:
>
> ```bash
> docker restart akahu-actual
> ```
>
> Consider setting up a cron job for automatic scheduling.

> [!NOTE]
> If you're deploying to Kubernetes, I suggest taking a look at the example in my homelab repo [here](https://github.com/scottmckendry/axis/blob/main/kubernetes/actual/akahu-actual/release.yaml).

### Option 2: Local Node.js Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the script:

```bash
npx tsc && node dist/index.js
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
