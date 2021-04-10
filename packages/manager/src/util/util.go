package util

func Err(err error) {
	if err != nil {
		panic(err)
	}
}