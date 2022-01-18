# FritzBox-Web-Callmonitor
> A simple call monitor web interface for Fritz!BOX routers.

[![forthebadge](https://forthebadge.com/images/badges/uses-badges.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/no-ragrets.svg)](https://forthebadge.com)

This web app simply fetches recent calls from a Fritz!BOX, tries to look up unknown numbers using dasoertliche.de and displays everything in a simple web interface.

## Installation / Setup

Linux, Windows & macOS:

```sh
npm install
```

Then set *environment variables* as necessary. The following variables are available:
* **USER** (Fritz!BOX username to use to connect, default *NOT SET*)
* **PASSWORD** (Fritz!BOX password to use to connect, default *NOT SET*)
* **HOST** (Fritz!BOX IP/FQDN, default *fritz.box*)
* **PROTOCOL** (Protocol to use to connect to Fritz!BOX, default *http*)
* **CALLS** (Number of recent calls to show, default *10*)

(For more information on the protocol variable, check [lesander/fritzbox.js](https://github.com/lesander/fritzbox.js/).)

## Usage

Run installation, then run

```sh
node app
```

If all environment variables are set correctly, the web interface will be available on port *3000*.

## Docker
### Dockerfile
This repository also includes a Dockerfile. Simply build it like this

```sh
docker build -t callmonitor .
```

and run it like this

```sh
docker run -p 3000:3000 -e USER=username -e PASSWORD=password [-e HOST=192.168.178.5] [-e PROTOCOL=http] [-e CALLS=10] callmonitor
```
Explanation:
* **-p 3000:3000**: Maps host port 3000 to the app's listening port 3000. Change first port to suit your setup.
* **-e USER**: Sets the username to use when requesting calls from a Fritz!BOX.
* **-e PASSWORD**: Sets the password to use.
* **-e HOST**: [OPTIONAL], Sets IP address of the Fritz!BOX to connect to.
* **-e PROTOCOL**: [OPTIONAL], Sets the protocol to use to communicate with the Fritz!BOX.
* **-e CALLS**: [OPTIONAL], Sets the number of recent calls to show.

## Release History

* 1.0.0
    * First release

## Meta

lukasklinger – [@cyaniccerulean](https://twitter.com/cyaniccerulean) – [lukasklinger.com](https://lukasklinger.com)

[https://github.com/lukasklinger](https://github.com/lukasklinger/)

[https://git.lukasklinger.com/lukas](https://git.lukasklinger.com/lukas)

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
