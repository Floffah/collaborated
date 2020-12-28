[![Netlify Status](https://api.netlify.com/api/v1/badges/5b2928d4-ab11-45ed-a18e-3040feeb74ca/deploy-status)](https://app.netlify.com/sites/determined-pike-df8a24/deploys)
![CodeQL](https://github.com/Floffah/collaborated/workflows/CodeQL/badge.svg)
![Docs](https://github.com/Floffah/collaborated/workflows/Docs/badge.svg)

**PLEASE NOTE**
In this repository, issues should only be created for bug reports. If you have a feature request, question, or anything else you want to talk about, use the discussions tab.

# Collaborated

```js
// TODO: write readme
```

## Links
[All docs](https://capp.floffah.dev/?path=/story/developers-contents--page) <br>
[Setting up a development environment](https://capp.floffah.dev/?path=/story/developers-contributors-development-environment--page) <br>
[Storybook](https://capp.floffah.dev) <br>
[UI Preview](https://preview.capp.floffah.dev) (this isn't usually connected to any api)

## Warnings
 - When using the manager, make sure you:
	1. use a prebuilt
	2. if developing it, write as much as you can then test because it takes a while to compile (on windows w/msys2 mingw64 atleast)
	
## Building the manager
1. Run `go install -v -x -a -i` in capp_root/services/manager (you only need to this once, this saves the build command from building libraries every time)
2. Run `yarn manager` to build it

### "Invalid flag in pkg-config" err
Go to PKG_CONFIG_PATH/gdk-3.0.pc and PKG_CONFIG_PATH/gdk-2.0.pc (these will have -win32- in the middle on windows, make sure to change it in all 4) and remove the -Wl, flag (make sure to remove the comma after too)
On windows I found this in wherever_mingw64/32_is/lib/pkgconfig (in my case it was C:/msys2/mingw64/lib/pkgconfig

Once you have corrected this you may need to rerun the install and manager command to make sure the build is correct
