defmodule CappBackend.Context do
  @behaviour Plug

  import Plug.Conn
  import Ecto.Query, only: [where: 2]

  alias CappBackend.{Repo}
  alias CappBackend.Entities.{User}

  def init(opts), do: opts

  def call(conn, _) do
    context = build_context(conn)
    Absinthe.Plug.put_options(conn, context: context)
  end

  def build_context(conn) do
    with [access] <- get_req_header(conn, "access"),
         {:ok, user} <- authorize(access) do
      %{user: user}
    else
      _ -> %{}
    end
  end

  defp authorize(access) do
    User
    |> where(access: ^access)
    |> Repo.one
    |> case do
         nil -> {:error, "Invalid access key. Did it expire?"}
         user -> {:ok, user}
       end
  end
end
