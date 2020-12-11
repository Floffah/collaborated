package util

func MFErr(err error) {
	if err != nil {
		panic(err)
	}
}