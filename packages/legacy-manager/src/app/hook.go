package app

import (
    "bytes"
    "cappmanager/src/util"
    "crypto/sha256"
    "encoding/hex"
    "encoding/json"
    "fmt"
    "github.com/valyala/fasthttp"
    "os"
    "strconv"
)

type HookError struct {
    Status  int    `json:"status"`
    Message string `json:"message"`
}

func (a *App) StartHooks() {
    port, err := util.GetPort()
    if err != nil {
        fmt.Println("Could not find an empty port to use")
        os.Exit(1)
    }
    go fasthttp.ListenAndServe("0.0.0.0:"+strconv.Itoa(port), a.RequestHandler)
    fmt.Printf("Listening on 0.0.0.0:%s\n", strconv.Itoa(port))
}

func (a *App) RequestHandler(ctx *fasthttp.RequestCtx) {
    if !ctx.IsPost() {
        a.SendError(ctx, fasthttp.StatusBadRequest, "Must use post")
        return
    }

    sig := ctx.Request.Header.Peek("X-Hub-Signature-256")
    if len(sig) <= 0 {
        a.SendError(ctx, fasthttp.StatusBadRequest, "Must supply X-Hub-Signature-256 header")
        return
    }

    hasher := sha256.New()
    hasher.Write([]byte("sha256=" + a.cfg.Section("Hooks").Key("secret").String()))
    hash := []byte(hex.EncodeToString(hasher.Sum(nil)))

    comparison := bytes.Compare(hash, sig)

    if comparison != 0 {
        a.SendError(ctx, fasthttp.StatusBadRequest, "Incorrect hashed secret")
    }
}

func (a *App) SendError(ctx *fasthttp.RequestCtx, status int, message string) {
    ctx.Response.Header.SetContentType("application/json")
    ctx.Response.SetStatusCode(status)
    err := HookError{
        Status:  status,
        Message: message,
    }
    json.NewEncoder(ctx.Response.BodyWriter()).Encode(err)
}
