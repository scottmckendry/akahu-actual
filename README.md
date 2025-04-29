# Akahu to Actual Budget 🚀

A dead-simple script that connects the brilliant [Akahu API](https://akaku.nz/) to the equally brilliant [Actual Budget](https://actualbudget.org/) app.

An ideal solution for Kiwis who want to use Actual Budget to manage their finances, but find the manual import process a bit tedious.

## ⚡How it works

1. Connects to the Akahu API using your personal app and user tokens.
2. Pulls transactions from all connected accounts, mapping them to their corresponding Actual Budget accounts.
3. Transforms the transactions into a format that Actual Budget can understand.
4. Pushes the transactions to Actual Budget using its API.

## 🌱 Getting Started

Once cloned, you'll want to set the following environment variables in a `.env` file in the root of the project:

```bash
# akahu app credentials
AKAHU_APP_TOKEN=app_token_abcd
AKAHU_USER_TOKEN=user_token_1234

# account mappings in the format {"akahu_account_id": "actual_account_id"} - TODO: document how to get these
ACCOUNT_MAPPINGS={"akahu_account_id_1":"actual_account_id_1", "akahu_account_id_2":"actual_account_id_2"}

ACTUAL_SERVER_URL=http://localhost:5006             # URL of your Actual server
ACTUAL_PASSWORD=password                            # your actual master password
ACTUAL_SYNC_ID=00000000-0000-0000-0000-000000000000 # UUID can be found in Actual under Settings -> Advanced Settings
DAYS_TO_FETCH=7                                     # optional number of days to search back in Akahu transactions, default is 7 days
```

Install dependencies with:

```bash
npm install
```

Then run the script with:

```bash
tsc && node dist/index.js
```

<!-- Since most people will want to run this alongside their Actual server, there's a good chance they'll be using docker.  -->

<!-- TODO: containerize this script and provide instructions for running it on a docker server. -->
