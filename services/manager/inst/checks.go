package inst

import (
	"errors"
	"github.com/go-git/go-git/v5"
	"github.com/manifoldco/promptui"
	"manager/util"
	"os"
	"path"
)

func CheckForInst() {
	cwd := util.CWD()
	root := path.Join(cwd, "collaborated")
	if _,err:= os.Stat(root); os.IsNotExist(err) {
		validate := func(i string) error {
			if i != "y" && i != "n" {
				return errors.New("Must be 'y' or 'n'")
			}
			return nil
		}

		prompt := promptui.Prompt{
			Label: "Clone collaborated? (y,n)",
			Validate: validate,
		}

		result,err2 := prompt.Run()
		util.MFErr(err2)

		if result == "y" {
			_, err = git.PlainClone(root, false, &git.CloneOptions{
				URL: "https://github.com/Floffah/collaborated",
			})
			util.MFErr(err)
		} else {
			os.Exit(1)
		}
	}
}
