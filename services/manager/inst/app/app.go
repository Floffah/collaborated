package app

import (
	"github.com/gotk3/gotk3/gdk"
	"github.com/gotk3/gotk3/glib"
	"github.com/gotk3/gotk3/gtk"
	"manager/inst"
	"manager/util"
)

type App struct {
	app *gtk.Application
	win *gtk.ApplicationWindow
}

func NewApp() App {
	return App{}
}

func (a *App) Preflight() {
	inst.CheckForInst()

	app, err := gtk.ApplicationNew("dev.floffah.capp.manager", glib.APPLICATION_FLAGS_NONE)
	util.MFErr(err)
	a.app = app

	_, err1 := a.app.Connect("activate", func() { a.Ready() })
	util.MFErr(err1)

	a.app.Run(nil)
}

func (a *App) Ready() {
	win, err := gtk.ApplicationWindowNew(a.app)
	util.MFErr(err)
	a.win = win

	a.win.SetTitle("Collaborated Manager")
	a.win.SetDefaultSize(400, 400)

	icon, err1 := gdk.PixbufNewFromFile("./collaborated/brand/collaborated(3.1).png")
	util.MFErr(err1)
	a.win.SetIcon(icon)

	a.win.Show()
}