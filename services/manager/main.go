package main

import (
	"flag"
	"manager/inst"
)

func main() {
	devMode := flag.NewFlagSet("dev", flag.ExitOnError)
    inst.CheckForInst()
}
