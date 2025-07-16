import { formatSecondsToMMSS } from "./formatTime";
import { saveAs } from "file-saver";
import JSZip from "jszip";

const generateTranscriptText = (transcript, useTiming = true) => {
  return transcript?.transcript
    .map((line) => {
      if (useTiming) {
        return `${formatSecondsToMMSS(line.start)} ${line.text}`;
      }
      return line.text;
    })
    .join("\n");
};

const downloadSingleTranscript = (transcript, videoTitle, useTiming = true) => {
  const transcriptText = generateTranscriptText(transcript, useTiming);
  const blob = new Blob([transcriptText], { type: "text/plain;charset=utf-8" });
  const saveTitle = videoTitle || "transcript";
  const fileName = `transcript_${saveTitle}.txt`;

  saveAs(blob, fileName);
};

const downloadMultipleTranscripts = async (transcripts) => {
  const zip = new JSZip();

  transcripts.forEach((transcript) => {
    const transcriptText = generateTranscriptText(transcript?.transcript);
    const saveTitle = transcript?.title || "video";
    const fileName = `transcript_${saveTitle}.txt`;
    zip.file(fileName, transcriptText);
  });

  const content = await zip.generateAsync({ type: "blob" });

  const zipFileName =
    transcripts.length === 1 ? transcripts[0].title : "all_transcripts.zip";

  saveAs(content, zipFileName);
};

export { downloadSingleTranscript, downloadMultipleTranscripts };
