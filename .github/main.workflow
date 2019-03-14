workflow "CI Pipeline" {
  on = "push"
  resolves = ["Push To Prod"]
}

action "Push To Prod" {
  uses = "w9jds/firebase-action@7d6b2b058813e1224cdd4db255b2f163ae4084d3"
  runs = ["sh","-c", "firebase deploy -m \'Pipeline $CI_PIPELINE_ID, build $CI_BUILD_ID\' -P default --non-interactive --token $FIREBASE_DEPLOY_KEY"]
  secrets = ["FIREBASE_DEPLOY_KEY"]
}
