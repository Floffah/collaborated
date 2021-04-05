# CappBackend

This is **not replacing** the current nodejs backend that exists, this is just a test to compare speeds (the nodejs backend should be able to handle 90k requests while the elixir backend should be able to take 300k)

The elixir backend will probably end up being used as a fallback and or reverse proxy

This package is intended to be used as an api and not for the actual website. Although this does serve static assets, it is recommended to sit it behind something like netlify or an nginx instance.

Go to http://localhost/api/v1?query={ping} to see if it is working

## API Errors

The keys are found as an integer in the capp_error field.

1. Path does not correspond to any endpoint