defmodule CappBackend.Resolvers.User do
  import Ecto.Query, only: [where: 2]

  alias CappBackend.{Repo}
  alias CappBackend.Entities.{User}

  def authenticate(
        _parent,
        args,
        res
      ) do
    if Map.has_key?(res, :user) do
      {:ok, %{access: res.user.access, refresh: res.user.refresh}}
    else
      User
      |> where(email: ^args.email, password: ^args.password)
      |> Repo.one
      |> case do
           nil -> {:error, "Invalid access key. Did it expire?"}
           user -> {:ok, %{access: user.access, refresh: user.refresh}}
         end
    end
  end
end
