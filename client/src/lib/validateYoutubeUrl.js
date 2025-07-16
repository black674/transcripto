const validateVideoUrl = (url) => {
  const regex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
  return regex.test(url);
};

const validateChannelUrl = (url) => {
  const regex =
    /^(https?:\/\/)?(www\.)?youtube\.com\/((@[a-zA-Z0-9_-]+)|([a-zA-Z0-9_-]+))(\/.*)?$/;

  if (regex.test(url)) {
    let channelUsername = url.split("youtube.com/")[1].split(/[/?&]/)[0];
    if (channelUsername.startsWith("@")) {
      channelUsername = channelUsername.substring(1);
    }
    return channelUsername;
  }
  return false;
};

const validatePlaylistUrl = (url) => {
  const regex =
    /^(https?:\/\/)?(www\.)?youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)$/;

  if (regex.test(url)) {
    let playlistId = url.split("list=")[1].split(/[/?&]/)[0];
    return playlistId;
  }
  return false;
};

export { validateVideoUrl, validateChannelUrl, validatePlaylistUrl };
