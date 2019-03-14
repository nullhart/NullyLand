workflow "CI Pipeline" {
  on = "push"
  resolves = ["Push To Prod"]
}

action "Push To Prod" {
  uses = "w9jds/firebase-action@7d6b2b058813e1224cdd4db255b2f163ae4084d3"
  runs = ["sh","-c", "yarn && npm run build && firebase deploy -P development --non-interactive --only hosting --token $FIREBASE_DEPLOY_KEY"]
  secrets = ["FIREBASE_DEPLOY_KEY"]
}