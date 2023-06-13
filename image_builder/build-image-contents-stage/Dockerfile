FROM i386/debian:buster AS fonts_downloader
WORKDIR /additional-fonts
RUN apt update && \
    apt --yes --no-install-recommends install ca-certificates wget && \
    wget "https://github.com/google/fonts/raw/main/ofl/inconsolata/static/Inconsolata-Regular.ttf" \
        "https://github.com/google/fonts/raw/main/ofl/firasans/FiraSans-Regular.ttf" \
        "https://github.com/google/fonts/raw/main/ofl/lato/Lato-Regular.ttf" \
        "https://github.com/google/fonts/raw/main/ufl/ubuntu/Ubuntu-Regular.ttf" \
        "https://github.com/google/fonts/raw/main/ufl/ubuntumono/UbuntuMono-Regular.ttf" \
        "https://github.com/google/fonts/raw/main/ofl/rubik/Rubik%5Bwght%5D.ttf" \
        "https://github.com/google/fonts/raw/main/ofl/ibmplexmono/IBMPlexMono-Regular.ttf" \
        "https://github.com/google/fonts/raw/main/ofl/ibmplexsans/IBMPlexSans-Regular.ttf"

FROM i386/debian:buster AS icons_downloader
ENV DEBIAN_FRONTEND noninteractive

RUN mkdir -p /additional-icons && \
    apt update && \
    apt --yes --no-install-recommends install ca-certificates git && \
    git clone https://github.com/horst3180/arc-icon-theme --depth 1 && cd arc-icon-theme && \
    mv Arc /additional-icons/

FROM i386/debian:buster AS libs_downloader
WORKDIR /additional-libs
RUN apt update && \
    apt --yes --no-install-recommends install ca-certificates git && \
    git clone "https://github.com/pijulius/picom" && cd picom && git submodule update --init --recursive

FROM i386/debian:buster

ENV DEBIAN_FRONTEND noninteractive

RUN apt update && \
    apt --yes --no-install-recommends install \
        linux-image-686 grub2 systemd \
        libterm-readline-perl-perl \
        python3 python3-serial \
        awesome \
        feh \
        # picom dependencies
        gcc meson ninja-build libxext-dev libxcb1-dev libxcb-damage0-dev libxcb-xfixes0-dev libxcb-shape0-dev libxcb-render-util0-dev libxcb-render0-dev libxcb-randr0-dev libxcb-composite0-dev libxcb-image0-dev libxcb-present-dev libxcb-xinerama0-dev libxcb-glx0-dev libpixman-1-dev libdbus-1-dev libconfig-dev libgl1-mesa-dev libpcre2-dev libpcre3-dev libevdev-dev uthash-dev libev-dev libx11-xcb-dev \
        xserver-xorg-input-kbd xserver-xorg-input-mouse xserver-xorg-input-evdev \
        xserver-xorg-video-fbdev xserver-xorg-video-vesa \
        xserver-xorg x11-xserver-utils xinit dbus-x11 \
        libgdk-pixbuf2.0 libpango-1.0 libpangocairo-1.0 libgtk2.0-bin \
        libc-l10n locales \
        fonts-noto fonts-droid-fallback \
        strace file xterm vim apt-file \
        # As we have no networking, those are somewhat useless
        # dhcpcd5 \
        # wget curl \
        # net-tools netcat \
        wmctrl xdotool \
        mesa-utils libgl1-mesa-dri \
    && \
    touch /root/.Xdefaults && \
    echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen && \
    locale-gen && \
    chsh -s /bin/bash && \
    echo "root:root" | chpasswd && \
    mkdir -p /etc/systemd/system/serial-getty@ttyS0.service.d/ && \
    systemctl enable serial-getty@ttyS0.service && \
    rm /lib/systemd/system/getty.target.wants/getty-static.service && \
    rm /etc/motd /etc/issue && \
    systemctl disable systemd-timesyncd.service && \
    systemctl disable apt-daily.timer && \
    systemctl disable apt-daily-upgrade.timer && \
    systemctl disable dhcpcd.service && \
    echo "tmpfs /tmp tmpfs nodev,nosuid 0 0" >> /etc/fstab && \
    apt-get --yes clean && \
    rm -r /var/lib/apt/lists/* && \
    rm -r /usr/share/doc/* && \
    rm -r /usr/share/man/* && \
    rm -r /usr/share/locale/?? && \
    rm /var/log/*.log /var/log/lastlog /var/log/wtmp /var/log/apt/*.log /var/log/apt/*.xz

COPY boot-9p /etc/initramfs-tools/scripts/boot-9p

# this needs to be commented out in order to boot from hdd
RUN printf '%s\n' 9p 9pnet 9pnet_virtio virtio virtio_ring virtio_pci | tee -a /etc/initramfs-tools/modules && \
    echo 'BOOT=boot-9p' | tee -a /etc/initramfs-tools/initramfs.conf && \
    update-initramfs -u

# install picom
COPY --from=libs_downloader /additional-libs/picom /additional-libs/picom
RUN cd /additional-libs/picom && meson --buildtype=release . build && ninja -C build && ninja -C build install
RUN mkdir -p ~/.config/picom

COPY --from=fonts_downloader /additional-fonts/ /usr/share/fonts/
COPY --from=icons_downloader /additional-icons/ /usr/share/icons/

COPY getty-noclear.conf getty-override.conf /etc/systemd/system/getty@tty1.service.d/
COPY getty-autologin-serial.conf /etc/systemd/system/serial-getty@ttyS0.service.d/

COPY logind.conf /etc/systemd/logind.conf
COPY profile /root/.profile
COPY rc-loader.lua /root/.config/awesome/rc-loader.lua
COPY xinitrc /root/.xinitrc
COPY vm_rpc_server.py /root/vm_rpc_server.py

COPY awesome-wm-widgets /root/.config/awesome/awesome-wm-widgets
COPY background /root/.config/awesome/background
COPY fake-acpi /usr/local/bin/acpi
