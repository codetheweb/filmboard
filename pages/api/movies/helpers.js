import fs from 'fs';
import path from 'path';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import hasha from 'hasha';
import {Trailer, File} from '../../../models';
import {BUCKET_PATH} from '../../../config';

export const downloadTrailer = async (url, movie) => {
  const trailerHash = hasha(url);
  const trailerPath = `${trailerHash}.mp4`;

  let trailer;

  if (fs.existsSync(path.join(BUCKET_PATH, trailerPath))) {
    const trailerFile = await File.findOne({where: {hash: trailerHash}});
    trailer = await Trailer.findOne({where: {FileId: trailerFile.id}});
  } else {
    const trailerFile = await File.create({hash: trailerHash, path: trailerPath});
    trailer = await Trailer.create({});
    await trailer.setFile(trailerFile);
  }

  await movie.setTrailer(trailer);

  if (trailer.progress === 1) {
    return;
  }

  return new Promise((resolve, reject) => {
    try {
      const audioOutput = path.join(BUCKET_PATH, `${trailerHash}.m4a`);
      const videoOutput = path.join(BUCKET_PATH, `${trailerHash}-temp.mp4`);
      const modifiedVideoOutput = path.join(BUCKET_PATH, `${trailerHash}.mp4`);

      // Download audio
      ytdl(url, {filter: format => format.mimeType.indexOf('audio/') === 0 && (format.container === 'm4a' || format.container === 'mp4')})
        .pipe(fs.createWriteStream(audioOutput))
        .on('finish', () => {
        // Update progress of download
          trailer.update({progress: 0.25});

          // Download video and assemble
          ffmpeg().input(ytdl(url, {quality: 'highestvideo'}))
            .videoCodec('copy')
            .input(audioOutput)
            .audioCodec('copy')
            .save(videoOutput)
            .on('end', async () => {
            // Update progress of download
              trailer.update({progress: 0.6});

              // Crop black bars
              await cropVideo(videoOutput, modifiedVideoOutput);

              // Update progress of download
              await trailer.update({progress: 1});

              resolve();
            });
        });
    } catch (error) {
      reject(error);
    }
  });
};

const cropVideo = (input, out) => {
  return new Promise((resolve, reject) => {
    try {
      // Remove black bars
      const cropCommands = [];
      ffmpeg(input)
        .seek(10) // Skip 10 seconds
        .duration(2) // Analyze 2 seconds
        .videoFilters('cropdetect')
        .format('null')
        .output('-')
        .on('stderr', stdLine => {
          const cropDimensions = /crop=.*/g.exec(stdLine);

          if (cropDimensions === null) {
            return;
          }

          cropCommands.push(cropDimensions[0]);
        })
        .on('end', () => {
          // Crop video
          ffmpeg(input)
            .videoFilters(mode(cropCommands))
            .audioCodec('copy')
            .save(out)
            .on('end', () => {
              resolve();
            });
        })
        .run();
    } catch (error) {
      reject(error);
    }
  });
};

function mode(arr) {
  return arr.sort((a, b) =>
    arr.filter(v => v === a).length -
        arr.filter(v => v === b).length
  ).pop();
}
