export $(grep -v '^#' ../../.env | xargs)
expect -c '
spawn pnpm run push
expect "job_analyses"
send "\033\[B\r"
expect "resume_versions"
send "\033\[B\r"
expect "workspace_profiles"
send "\033\[B\r"
expect eof
'
