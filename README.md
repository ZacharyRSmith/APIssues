# Issues RESTful API

Made for a code challenge.

Enables API client to:
- Create and view issues
- Upload files that are associated with an issue
- Download files associated with an issue

Assumptions:
- We want to store files in config.filesDir...I guess if we wanted to store files on an NFS instead of blob storage such as S3?
- Do not support uploading a file(s) at issue creation time

## Big-pic TODOs, ordered from most important(?) to least

(Note that smaller-pic TODOs are in code)

- Clean up swagger
- Store file names
- impl access logging
- get tests to not hang

## Environments

All environments need a connection to a mongo database.
