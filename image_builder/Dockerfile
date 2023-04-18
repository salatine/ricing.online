FROM i386/debian:buster

ENV DEBIAN_FRONTEND noninteractive

RUN apt update && \
    apt --yes --no-install-recommends install \
        linux-image-686 grub2 systemd \
        libterm-readline-perl-perl \
        git \
        python \
        awesome \
        feh \
        wget ca-certificates \
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
    echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen \
    locale-gen \
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
    echo "tmpfs /tmp tmpfs nodev,nosuid 0 0" >> /etc/fstab

WORKDIR /usr/share/fonts
RUN wget "https://github.com/google/fonts/raw/main/ofl/inconsolata/static/Inconsolata-Regular.ttf" \
        "https://github.com/google/fonts/raw/main/ofl/firasans/FiraSans-Regular.ttf" \
        "https://github.com/google/fonts/raw/main/ofl/lato/Lato-Regular.ttf" \
        "https://github.com/google/fonts/raw/main/ufl/ubuntu/Ubuntu-Regular.ttf" \
        "https://github.com/google/fonts/raw/main/ufl/ubuntumono/UbuntuMono-Regular.ttf" \
        "https://github.com/google/fonts/raw/main/ofl/rubik/Rubik%5Bwght%5D.ttf" \
        "https://github.com/google/fonts/raw/main/ofl/ibmplexmono/IBMPlexMono-Regular.ttf" \
        "https://github.com/google/fonts/raw/main/ofl/ibmplexsans/IBMPlexSans-Regular.ttf"
COPY getty-noclear.conf getty-override.conf /etc/systemd/system/getty@tty1.service.d/
COPY getty-autologin-serial.conf /etc/systemd/system/serial-getty@ttyS0.service.d/

COPY logind.conf /etc/systemd/logind.conf
RUN { \
    echo 'if [[ -z "$DISPLAY" ]] && [[ $(tty) = /dev/tty1 ]] && [[ ! -f ~/.x-autostarted ]]; then';\
    # echo 'echo "Waiting for 90s"';\
    # echo 'sleep 90s';\
    echo 'touch ~/.x-autostarted';\
    echo '. startx';\
    echo 'logout';\
    echo 'fi';\
} >> /root/.profile
COPY xinitrc /root/.xinitrc
COPY vm_rpc_server.py /root/vm_rpc_server.py
# COPY xorg.conf /etc/X11/
# COPY networking.sh /root/

RUN mkdir -p /root/.config/awesome/awesome-wm-widgets

COPY awesome-wm-widgets/battery-widget /root/.config/awesome/awesome-wm-widgets/battery-widget
COPY fake-acpi /usr/local/bin/acpi
COPY awesome-wm-widgets/brightness-widget /root/.config/awesome/awesome-wm-widgets/brightness-widget
COPY awesome-wm-widgets/volume-widget /root/.config/awesome/awesome-wm-widgets/volume-widget

RUN { \
    git clone https://github.com/horst3180/arc-icon-theme --depth 1 && cd arc-icon-theme; \
    ./autogen.sh --prefix=/usr; \
    sudo make install; \
    mv Arc/ /usr/share/icons/; \
}

COPY boot-9p /etc/initramfs-tools/scripts/boot-9p

# this needs to be commented out in order to boot from hdd
RUN printf '%s\n' 9p 9pnet 9pnet_virtio virtio virtio_ring virtio_pci | tee -a /etc/initramfs-tools/modules && \
    echo 'BOOT=boot-9p' | tee -a /etc/initramfs-tools/initramfs.conf && \
    update-initramfs -u

RUN apt-get --yes clean && \
    rm -r /var/lib/apt/lists/* && \
    rm -r /usr/share/doc/* && \
    rm -r /usr/share/man/* && \
    rm -r /usr/share/locale/?? && \
    rm /var/log/*.log /var/log/lastlog /var/log/wtmp /var/log/apt/*.log /var/log/apt/*.xz
