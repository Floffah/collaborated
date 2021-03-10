defmodule CappBackend.MixProject do
  use Mix.Project

  def project do
    [
      app: :capp,
      version: "0.1.0",
      elixir: "~> 1.11",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  def application do
    [
      extra_applications: [:logger],
      mod: {CappBackend.Application, []}
    ]
  end

  defp deps do
    [
      {:plug_cowboy, "~> 2.4"},
      {:absinthe, "~> 1.6"},
      {:absinthe_plug, "~> 1.5"},
      {:jason, "~> 1.2"}
    ]
  end
end
