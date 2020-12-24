package main

import (
	app2 "manager/inst/app"
	"os"
)

func main() {
	os.Setenv("GTK_CSD", "0")
	os.Setenv("gtk-theme-name", "win32")
	app := app2.NewApp()
	app.Preflight()
}
