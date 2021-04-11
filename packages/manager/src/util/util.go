package util

import (
	"errors"
	"net"
)

func Err(err error) {
	if err != nil {
		panic(err)
	}
}

func GetPort() (int, error) {
	addr, err := net.ResolveTCPAddr("tcp", "0.0.0.0:0")
	if err != nil {
		return 0, err
	}
	ln, err2 := net.ListenTCP("tcp", addr)
	if ln == nil {
		return 0, errors.New("listener was null")
	}
	defer ln.Close()
	if err2 != nil {
		return 0, err2
	}
	return ln.Addr().(*net.TCPAddr).Port, nil
}