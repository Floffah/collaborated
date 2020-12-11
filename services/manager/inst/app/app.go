package app

import "manager/inst"

type App struct {

}

func NewApp() App {
	return App{}
}

func (a *App) Preflight() {
	inst.CheckForInst()
}