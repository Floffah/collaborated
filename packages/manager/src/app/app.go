package app

import (
	"cappmanager/src/util"
	"context"
	"embed"
	"github.com/bradleyfalzon/ghinstallation"
	"github.com/google/go-github/v34/github"
	"github.com/kirsle/configdir"
	"gopkg.in/ini.v1"
	"net/http"
	"os"
	"path/filepath"
)

import _ "embed"

//go:embed 2021-04-10.private-key.pem
var pemfile embed.FS

type App struct {
	configPath string
	gh *github.Client
	cfg *ini.File
}

func NewApp() App {
	return App{}
}

func (a *App) Init() {
	a.configPath = configdir.LocalConfig("collaborated_manager")
	configdir.MakePath(a.configPath)

	pemf, err := pemfile.ReadFile("2021-04-10.private-key.pem")
	util.Err(err)

	pempath := filepath.Join(a.configPath, "gh_installation.private-key.pem")
	err2 := os.WriteFile(pempath, pemf, 0666)
	util.Err(err2)

	confpath := filepath.Join(a.configPath, "config.ini")
	if _, err4 := os.Stat(confpath); os.IsNotExist(err4) {
		f := ini.Empty()
		sect, _ := f.NewSection("Manager")
		sect.NewKey("mode", "master")
		sect.NewKey("owner", "floffah")
		sect.NewKey("repo", "collaborated")
		f.SaveTo(confpath)
		a.cfg = f
	} else {
		cfg, _ := ini.Load(confpath)
		a.cfg = cfg
	}

	itr, err3 := ghinstallation.NewKeyFromFile(http.DefaultTransport, 109746, 16126254, pempath)
	util.Err(err3)

	a.gh = github.NewClient(&http.Client{Transport: itr})

	msect := a.cfg.Section("Manager")
	a.gh.Checks.CreateCheckRun(context.Background(), msect.Key("owner").String(), msect.Key("repo").String(), github.CreateCheckRunOptions{
		Name: "Deploy test",
		HeadSHA: "a47c50b0d263a99fbd63bb5d1c2f683e2b1e5065",
		Conclusion: github.String("success"),
		Status: github.String("completed"),
	})
}