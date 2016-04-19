# Caliper, adapted for [RedHat OpenShift](https://www.openshift.com/).
### Reviving mini-breakpad-server
Mini-breakpad-server is basically abandonded at this point.  Breakpad is still amazing technology, and people want to use it.  Caliper is intended to be a middle ground between nothing and Socorro (Mozilla's breakpad infrastructure).

## Caliper holds your breaks.
This intends to be a simple server for crash reports sent by [google-breakpad](https://code.google.com/p/google-breakpad/). This version is adapted for deploying on OpenShift.

## Features

* Collecting crash reports with minidump files.
* Simple web interface for viewing translated crash reports.
* Uploading of symbols using google's tools for breakpad (symupload).

## Run locally

* `npm install .` - if this fails make sure you have node-gyp setup correctly
* `grunt` - I had issues running it on Windows. As far as I remember, I simply didn't run this one.
* Put your breakpad symbols under `pool/symbols/PDBNAME/PDBUNIQUEIDENTIFIER/PDBNAMEASSYM`
* OR send a POST request to your server at /symbol_upload using google's symupload tool.
* `node lib/app.js`

## Breakpad crash sending
In the SendCrashReport function that breakpad provides, simply put "http://your.site/crash_upload".

## Environment variables used by this edition
### OpenShift variables:
* OPENSHIFT_NODEJS_IP
* OPENSHIFT_NODEJS_PORT
* OPENSHIFT_SECRET_TOKEN
Documentation can be found [here](https://developers.openshift.com/languages/nodejs/environment-variables.html) and [here](https://developers.openshift.com/managing-your-applications/environment-variables.html).
### Custom variables:
* CALIPER_ADMIN_PASSWORD - password for logging in as "admin". If not set, generated randomly.
* CALIPER_API_KEY - API key for your server. If not set, generated randomly.
* CALIPER_SERVER_ROOT - some outdated root path variable. If not set, empty.
