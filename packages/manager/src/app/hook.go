package app

import (
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"github.com/valyala/fasthttp"
)

type HookError struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
}

func (a *App) StartHooks() {
	fasthttp.ListenAndServe(":6491", a.RequestHandler)
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
