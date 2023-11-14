#! /bin/bash
FILE=/root/runner-setup.txt
if [ ! -f "$FILE" ]; then
    ## Install NodeJS v18.4.0
    apt-get update
    apt-get install -y ca-certificates curl gnupg libdigest-sha-perl
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
    export NODE_MAJOR=18
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
    apt-get update
    apt-get install nodejs -y
    ## Install Browsers. 
    npx playwright install --with-deps
    ## Install Github runner.
    ## Install 
    mkdir actions-runner && cd actions-runner
    curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz
    # echo "29fc8cf2dab4c195bb147384e7e2c94cfd4d4022c793b346a6175435265aa278 actions-runner-linux-x64-2.311.0.tar.gz" | shasum -a 256 -c 
    tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz
    rm ./actions-runner-linux-x64-2.311.0.tar.gz
    ### Config
    export RUNNER_ALLOW_RUNASROOT="1"
    ./config.sh --url ${github_repo_url} --token ${github_token_runner} --unattended
    echo "" > $FILE
    /actions-runner/run.sh
else
    export RUNNER_ALLOW_RUNASROOT="1"
    /actions-runner/run.sh
fi
