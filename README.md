# Issues RESTful API

Enables API client to:
- Create and view issues
- Upload files that are associated with an issue
- Download files associated with an issue

Assumptions:
- Do not support uploading a file(s) at issue creation time

## Big-pic TODOs, ordered from most important(?) to least

(Note that smaller-pic TODOs are in code)

- Clean up swagger
- Store file names
- impl access logging
- get tests to not hang

## Environments

All environments need a connection to a mongo database.
