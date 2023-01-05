mkdir -p /dev/net
mknod /dev/net/tun c 10 200
chmod 600 /dev/net/tun
cat /dev/net/tun

f5fpc -s -t vpn.univie.ac.at -u yehorc28 -p $PASSWORD -d /etc/ssl/certs

node server.js