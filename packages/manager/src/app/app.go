package app

import (
	"cappmanager/src/util"
	"context"
	"embed"
	"flag"
	"fmt"
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
	gh         *github.Client
	cfg        *ini.File
}

func NewApp() App {
	return App{}
}

func (a *App) Init() {
	a.SetupConfig()

	msect := a.cfg.Section("Manager")
	mode := flag.String("mode", msect.Key("mode").String(), "Mode to use and set")
	owner := flag.String("owner", msect.Key("owner").String(), "Owner to use and set")
	repo := flag.String("repo", msect.Key("repo").String(), "Repo to use and set")

	hsect := a.cfg.Section("Hooks")
	secret := flag.String("secret", hsect.Key("secret").String(), "Secret to use and set")

	nostart := flag.Bool("noStart", false, "Pass this to not start listening for webhooks, talking to github, or starting the elixir server.")

	flag.Parse()

	msect.Key("mode").SetValue(*mode)
	msect.Key("owner").SetValue(*owner)
	msect.Key("repo").SetValue(*repo)

	hsect.Key("secret").SetValue(*secret)

	a.cfg.SaveTo(filepath.Join(a.configPath, "config.ini"))

	if *nostart {
		fmt.Println("-noStart was passed. Exiting...")
		os.Exit(0)
	}

	a.SetupGitHub()
	a.StartHooks()
}

func (a *App) SetupConfig() {
	a.configPath = configdir.LocalConfig("collaborated_manager")
	configdir.MakePath(a.configPath)

	confpath := filepath.Join(a.configPath, "config.ini")
	if _, err4 := os.Stat(confpath); os.IsNotExist(err4) {
		f := ini.Empty()

		msect, _ := f.NewSection("Manager")
		msect.NewKey("mode", "master")
		msect.NewKey("owner", "floffah")
		msect.NewKey("repo", "collaborated")

		hsect, _ := f.NewSection("Hooks")
		hsect.NewKey("secret", "SOME GITHUB WEBHOOK SECRET")

		a.cfg = f
	} else {
		cfg, _ := ini.Load(confpath)
		a.cfg = cfg
	}

	fmt.Printf("Config is at path %s\n", confpath)
}

func (a *App) SetupGitHub() {
	pemf, err := pemfile.ReadFile("2021-04-10.private-key.pem")
	util.Err(err)

	pempath := filepath.Join(a.configPath, "gh_installation.private-key.pem")
	err2 := os.WriteFile(pempath, pemf, 0666)
	util.Err(err2)

	itr, err3 := ghinstallation.NewKeyFromFile(http.DefaultTransport, 109746, 16126254, pempath)
	itr.Token(context.WithValue(context.Background(), "secret", a.cfg.Section("Hooks").Key("secret").String()))
	util.Err(err3)

	a.gh = github.NewClient(&http.Client{Transport: itr})
}
