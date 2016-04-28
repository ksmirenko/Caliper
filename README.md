# Server for Google Breakpad, adapted for [RedHat OpenShift](https://www.openshift.com/).

This intends to be a simple server for crash reports sent by [google-breakpad](https://code.google.com/p/google-breakpad/). This version is adapted for deploying on OpenShift. For more details and deployment guide, please see [wiki](https://github.com/ksmirenko/breakpad-openshift-server/wiki).

## Features

* Collecting crash reports with minidump files.
* Viewing translated crash reports via a simple web interface.
* Collecting symbol files which are sent with google's symupload tool.

## Run locally

* `npm install .` - if this fails make sure you have node-gyp setup correctly
* `grunt` - I had issues running it on Windows. As far as I remember, I simply didn't run this one.
* Put your breakpad symbols under `pool/symbols/PDBNAME/PDBUNIQUEIDENTIFIER/PDBNAMEASSYM`
* OR send a POST request to your server at /symbol_upload using google's symupload tool.
* `node lib/app.js`

## Breakpad crash sending

In the SendCrashReport function that breakpad provides, simply put "http://your.site/crash_upload".
