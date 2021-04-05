import Config

config :capp,
  ecto_repos: [CappBackend.Repo]

config :capp, CappBackend.Repo,
  database: "db",
  username: "username",
  port: 5432,
  password: "password",
  hostname: "example.com",
  url: "postgres://username:password@example.com:5432/db"
