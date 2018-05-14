# degTrivia

## Environment Setup
Begin by installing Firebase CLI globally by running `npm install -g firebase-tools`

Create a `.firebaserc` file in the root directory of the project. Add this to it:
```
{
  "projects": {
    "default": "degtrivia-develop"
  }
}
```
The value of *default* will change per environment.
For develop:
"default": "degtrivia-develop"

For staging: 
"default": "degtrivia-staging"

For production:
"default": "degtrivia-production"

If you do not have a public directory, copy the source directory and rename it *public*

## Commands
Use command `npm test` to run jest tests

Use command `npm run build` to run build tasks

Use command `npm run watch` to run watcher on files

Use command `npm run serve` to run a local firebase server

Use command `npm run serve-patternlab` to run a local Pattern Lab server

User command `npm start` to run build tasks, fire up watcher and start the local firebase and Pattern Lab servers