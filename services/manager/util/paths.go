package util

import "os"

func CWD() string {
	cwd, err := os.Getwd()
	MFErr(err)
	return cwd
}