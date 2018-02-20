apt-get -y install \
  autoconf \
  automake \
  build-essential \
  cmake \
  git \
  libass-dev \
  libfreetype6-dev \
  libsdl2-dev \
  libtheora-dev \
  libtool \
  libva-dev \
  libvdpau-dev \
  libvorbis-dev \
  libxcb1-dev \
  libxcb-shm0-dev \
  libxcb-xfixes0-dev \
  mercurial \
  pkg-config \
  texinfo \
  wget \
  zlib1g-dev

mkdir -p ./build ./build/lib ./build/bin
cd ./build

git -C x264 pull 2> /dev/null || git clone --depth 1 http://git.videolan.org/git/x264
git -C libvpx pull 2> /dev/null || git clone --depth 1 https://chromium.googlesource.com/webm/libvpx.git

wget -O lame-3.100.tar.gz http://downloads.sourceforge.net/project/lame/lame/3.100/lame-3.100.tar.gz
tar xzvf lame-3.100.tar.gz
rm -rf lame-3.100.tar.gz
mv ./lame-3.100 ./lame

git -C opus pull 2> /dev/null || git clone --depth 1 https://github.com/xiph/opus.git

wget -O ffmpeg-snapshot.tar.bz2 http://ffmpeg.org/releases/ffmpeg-snapshot.tar.bz2
tar xjvf ffmpeg-snapshot.tar.bz2
rm -rf ffmpeg-snapshot.tar.bz2